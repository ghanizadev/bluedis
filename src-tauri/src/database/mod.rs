pub mod commands;
mod hash;
mod list;
mod set;
mod string;
mod zset;

use crate::database::zset::ZSetKey;
use futures::future::join_all;
use redis::{
    parse_redis_url, Client, Commands, Connection, ConnectionAddr, ConnectionInfo, FromRedisValue,
    RedisConnectionInfo,
};
use serde::{Deserialize, Serialize};
use std::ops::Deref;
use std::thread::Thread;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::command;

#[derive(Default, Clone, Serialize, Deserialize, Debug)]
pub struct Key {
    key: String,
    value: String,
    is_new: bool,
    ttl: i64,
    key_type: String,
}

#[derive(Default, Clone, Debug)]
pub struct Database {
    conn_str: String,
    host: String,
    password: String,
    port: u16,
    tls: bool,
    db_index: i64,
}

impl Database {
    pub fn new(connection_str: String) -> Database {
        let url = parse_redis_url(connection_str.as_str()).expect("");

        Database {
            conn_str: connection_str.clone(),
            host: url.host_str().unwrap_or("localhost").to_string(),
            password: url.password().unwrap_or("").to_string(),
            port: url.port().unwrap_or(6379),
            tls: url.scheme() == "rediss",
            db_index: 0,
        }
    }

    pub fn get_connection(&self) -> Result<Connection, Box<dyn std::error::Error>> {
        let c_info = ConnectionInfo {
            redis: RedisConnectionInfo {
                db: self.db_index,
                password: if self.password.is_empty() {
                    None
                } else {
                    Some(self.password.clone())
                },
                username: None,
            },
            addr: if self.tls {
                ConnectionAddr::TcpTls {
                    host: self.host.clone(),
                    port: self.port,
                    insecure: true,
                }
            } else {
                ConnectionAddr::Tcp(self.host.clone(), self.port)
            },
        };

        let c = Client::open(c_info)?;
        Ok(c.get_connection()?)
    }

    pub fn check_connection(&mut self) -> Result<bool, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let command = redis::cmd("PING");
        let result = command.query::<String>(&mut connection)?;
        let mut is_connected = false;

        if result == "PONG" {
            is_connected = true;
        }

        Ok(is_connected)
    }

    pub fn set_ttl(&mut self, key: &str, ttl: i64, absolute: Option<bool>) {
        let mut connection = self.get_connection().unwrap();

        if ttl < 0 {
            connection
                .persist::<&str, ()>(key)
                .expect("failed to persist");
        } else {
            match absolute {
                None => {
                    connection
                        .pexpire_at::<&str, i64>(key, ttl as usize)
                        .expect("failed to set ttl");
                }
                Some(is_abs) => {
                    if is_abs {
                        connection
                            .pexpire::<&str, i64>(key, ttl as usize)
                            .expect("failed to set ttl");
                    } else {
                        connection
                            .pexpire_at::<&str, i64>(key, ttl as usize)
                            .expect("failed to set ttl");
                    }
                }
            }
        }
    }

    pub fn get_ttl(&mut self, key: &str) -> Result<i64, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let ttl = redis::cmd("PTTL").arg(key).query::<i64>(&mut connection)?;
        let start = SystemTime::now();
        let now = start
            .duration_since(UNIX_EPOCH)
            .expect("failed to fetch timestamp");

        if ttl > 0 {
            Ok(now.as_millis() as i64 + ttl)
        } else {
            Ok(ttl)
        }
    }

    pub async fn create_key(
        &self,
        key_name: String,
        key_type: String,
        ttl: i64,
        abs: bool,
    ) -> Result<Key, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let mut pipeline = redis::pipe();

        let expire_command = if abs { "PEXPIREAT" } else { "PEXPIRE" };
        let mut value: String;

        match key_type.as_str() {
            "set" => {
                pipeline
                    .cmd("SADD")
                    .arg(&key_name)
                    .arg("new set value")
                    .ignore();

                value = "[\"new set value\"]".into();
            }
            "zset" => {
                pipeline
                    .cmd("ZADD")
                    .arg(&key_name)
                    .arg(100)
                    .arg("new zset value")
                    .ignore();

                value = "[{\"score\":100,\"value\":\"new zset value\"}]".into();
            }
            "list" => {
                pipeline
                    .cmd("RPUSH")
                    .arg(&key_name)
                    .arg("new list value")
                    .ignore();

                value = "[\"new list value\"]".into();
            }
            "hash" => {
                pipeline
                    .cmd("HSET")
                    .arg(&key_name)
                    .arg("key")
                    .arg("new hash value")
                    .ignore();

                value = "{\"key\":\"new hash value\"}".into();
            }
            "string" => {
                pipeline
                    .cmd("SET")
                    .arg(&key_name)
                    .arg("new string value")
                    .ignore();

                value = "new string value".into();
            }
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The key_type \"{}\" is not valid: \"set\", \"zset\", \"list\", \"hash\" or \"string\"",
                    &key_type
                ));

                return Err(error);
            }
        }

        if ttl > 0 {
            pipeline
                .cmd(expire_command)
                .arg(&key_name)
                .arg(ttl)
                .ignore();
        }

        pipeline.query(&mut connection)?;

        Ok(Key {
            key: key_name,
            ttl,
            key_type,
            value,
            is_new: true,
        })
    }

    pub fn search_keys<F: Fn(Vec<Key>, u64)>(
        &mut self,
        pattern: String,
        cursor: u64,
        limit: Option<u64>,
        callback: F,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;

        let l = limit.unwrap_or(100);
        let mut done = false;
        let mut new_cursor = cursor;

        while !done {
            let mut command = redis::cmd("SCAN");
            command.arg(new_cursor);
            command.arg("MATCH");
            command.arg(pattern.clone());
            command.arg("COUNT");
            command.arg(10);

            let (c, mut keys) = command.query::<(String, Vec<String>)>(&mut connection)?;
            new_cursor = match c.parse::<u64>() {
                Ok(c) => c,
                _ => new_cursor,
            };

            if !keys.is_empty() {
                let mut pipeline = redis::pipe();

                for item in &keys {
                    pipeline.cmd("TYPE").arg(item);
                }

                let mut response = vec![];
                let key_types = pipeline.query::<Vec<String>>(&mut connection)?;

                let mut i = 0;

                while i < keys.len() {
                    let key_type = key_types.get(i).unwrap_or(&"".to_string()).to_string();
                    let key = keys.get(i).unwrap_or(&"".to_string()).to_string();

                    response.push(Key {
                        key,
                        key_type,
                        is_new: false,
                        ttl: -1,
                        value: "[]".to_string(),
                    });

                    i += 1;
                }

                callback(response, new_cursor);
            }

            done = new_cursor == 0 || keys.len() as u64 >= l;
        }

        Ok(())
    }

    pub async fn find_keys(
        &mut self,
        pattern: String,
        cursor: u64,
        limit: Option<u64>,
    ) -> Result<(Vec<Key>, u64), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;

        let mut new_cursor = cursor;
        let l = limit.unwrap_or(100);
        let mut done = false;

        let mut items: Vec<String> = vec![];

        while !done {
            let mut command = redis::cmd("SCAN");
            command.arg(new_cursor);
            command.arg("MATCH");
            command.arg(pattern.clone());
            command.arg("COUNT");
            command.arg(10);

            let (c, mut r) = command.query::<(String, Vec<String>)>(&mut connection)?;
            new_cursor = match c.parse::<u64>() {
                Ok(c) => c,
                _ => new_cursor,
            };

            items.append(&mut r);

            done = new_cursor == 0 || items.len() as u64 >= l;
        }

        println!("items: {}:?", items.len());

        let mut pipeline = redis::pipe();

        for item in &items {
            pipeline.cmd("TYPE").arg(item);
        }

        let mut response = vec![];
        let key_types = pipeline.query::<Vec<String>>(&mut connection)?;

        println!("types: {}:?", key_types.len());

        let mut i = 0;

        while i < items.len() {
            let key_type = key_types.get(i).unwrap_or(&"".to_string()).to_string();
            let key = items.get(i).unwrap_or(&"".to_string()).to_string();

            response.push(Key {
                key_type,
                key,
                ttl: -1,
                is_new: false,
                value: "[]".into(),
            });

            i += 1;
        }

        Ok((response, new_cursor))
    }

    pub fn count(&mut self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let command = redis::cmd("DBSIZE");
        let count = command.query::<usize>(&mut connection);

        Ok(count?)
    }

    pub fn select_db(&mut self, index: i64) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        redis::cmd("SELECTDB")
            .arg(index)
            .query::<()>(&mut connection)?;

        self.db_index = index;

        Ok(())
    }

    pub fn rm_keys(&mut self, keys: Vec<&str>) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        connection.del::<Vec<&str>, ()>(keys)?;
        Ok(())
    }

    pub async fn get_key(&self, key: String) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let mut key_type_cmd = redis::cmd("TYPE");
        key_type_cmd.arg(&key);

        let key_type = key_type_cmd.query::<String>(&mut connection)?;

        match key_type.as_str() {
            "set" => set::get(self.clone(), &mut connection, key.as_str(), vec![]),
            "zset" => zset::get(&mut connection, key.as_str()),
            "hash" => hash::get(self.clone(), &mut connection, key.as_str(), vec![]),
            "list" => list::get(self.clone(), &mut connection, key.as_str(), vec![]),
            "string" => string::get(self.clone(), &mut connection, key.as_str(), vec![]),
            _ => {
                let error = Box::<dyn std::error::Error>::from("The key could not be found");
                Err(error)
            }
        }
    }

    pub async fn set_key(
        &self,
        key: String,
        value: String,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;

        let mut pipeline = redis::pipe();

        pipeline.cmd("TYPE");
        pipeline.arg(&key);

        pipeline.cmd("DEL").arg(&key).ignore();

        let key_type = pipeline.query::<String>(&mut connection)?;

        match key_type.as_str() {
            "set" => set::set(
                self.clone(),
                &mut connection,
                key.as_str(),
                vec![value.as_str()],
            ),
            "zset" => zset::set(&mut connection, key.as_str(), &value),
            "hash" => hash::set(
                self.clone(),
                &mut connection,
                key.as_str(),
                vec![value.as_str()],
            ),
            "list" => list::set(
                self.clone(),
                &mut connection,
                key.as_str(),
                vec![value.as_str()],
            ),
            "string" => string::set(
                self.clone(),
                &mut connection,
                key.as_str(),
                vec![value.as_str()],
            ),
            _ => {
                let error = Box::<dyn std::error::Error>::from("The key could not be found");
                Err(error)
            }
        }
    }

    pub async fn set_zset_member(
        &self,
        key: String,
        value: Option<ZSetKey>,
        old_value: Option<String>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;

        if let Some(v) = value {
            return zset::set_zset_member(&mut connection, key, v, old_value);
        };

        Ok(None)
    }

    pub async fn del_zset_member(
        &self,
        key: String,
        value: Option<String>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        zset::del_zset_member(&mut connection, key, value)
    }

    pub fn command<T: FromRedisValue>(&mut self, comm: &str, args: Option<Vec<&str>>) -> T {
        let mut connection = self.get_connection().unwrap();
        let mut command = redis::cmd(comm);

        match args {
            None => {}
            Some(a) => {
                for arg in a {
                    command.arg::<&str>(arg);
                }
            }
        }

        command.query::<T>(&mut connection).unwrap()
    }
}
