#[cfg(not(tarpaulin_include))]
pub mod commands;
mod hash;
mod list;
mod set;
mod string;
mod zset;

#[cfg(test)]
mod test;

use std::time::Duration;

use crate::{database::zset::ZSetKey, helper::get_timestamp, state::AppState};
use redis::{
    parse_redis_url, Client, Commands, Connection, ConnectionAddr, ConnectionInfo,
    RedisConnectionInfo,
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

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
    host: String,
    password: String,
    port: u16,
    tls: bool,
    db_index: i64,
}

impl Database {
    pub fn new(connection_str: String) -> Database {
        let url = parse_redis_url(connection_str.as_str()).expect(format!("Failed to parse Redis URL: {}", connection_str).as_str());

        Database {
            host: url.host_str().unwrap_or("localhost").to_string(),
            password: url.password().unwrap_or("").to_string(),
            port: url.port().unwrap_or(6379),
            tls: url.scheme() == "rediss",
            db_index: 0,
        }
    }

    pub fn with_index(&mut self, index: i64) -> Self {
        self.db_index = index;
        self.clone() //TODO is it necessary?
    }

    pub async fn get_connection(&self) -> Result<Connection, Box<dyn std::error::Error>> {
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
        Ok(c.get_connection_with_timeout(Duration::from_secs(12))?)
    }

    pub async fn check_connection(&self) -> Result<bool, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;

        let command = redis::cmd("PING");
        let result = command.query::<String>(&mut connection)?;
        let mut is_connected = false;

        if result == "PONG" {
            is_connected = true;
        }

        Ok(is_connected)
    }

    pub async fn set_ttl(
        &self,
        key: String,
        ttl: i64,
        absolute: Option<bool>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await.unwrap();

        if ttl < 0 {
            connection
                .persist::<String, ()>(key.to_string())
                .expect("failed to persist");
        } else {
            match absolute {
                None => {
                    connection
                        .pexpire::<&str, i64>(&key, ttl as usize)
                        .expect("failed to set ttl");
                }
                Some(is_abs) => {
                    if is_abs {
                        connection
                            .pexpire_at::<&str, i64>(&key, ttl as usize)
                            .expect("failed to set ttl");
                    } else {
                        connection
                            .pexpire::<&str, i64>(&key, ttl as usize)
                            .expect("failed to set ttl");
                    }
                }
            };
        };

        self.get_key(key).await
    }

    pub async fn get_ttl(&self, key: &str) -> Result<i64, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let ttl = redis::cmd("PTTL").arg(key).query::<i64>(&mut connection)?;

        if ttl > 0 {
            Ok(ttl + get_timestamp())
        } else {
            Ok(ttl)
        }
    }

    pub async fn get_config(&self) -> Result<String, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let mut pipeline = redis::cmd("CONFIG");

        pipeline.arg("GET").arg(r"*");

        let cfg = pipeline.query::<Vec<String>>(&mut connection)?;
        let mut map = Map::new();

        for (index, key) in cfg.iter().enumerate() {
            if index % 2 == 0 {
                map.insert(key.clone(), Value::from(cfg[index + 1].clone()));
            }
        }

        Ok(serde_json::to_string(&map)?)
    }

    pub async fn get_info(&self) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let mut pipeline = redis::pipe();

        let mut response: Vec<String> = vec![];

        pipeline.cmd("INFO");

        let result = pipeline.query::<Vec<String>>(&mut connection)?;

        for r in result {
            let mut map = Map::new();
            let data = r
                .as_str()
                .split_whitespace()
                .map(|item| item.to_string())
                .collect::<Vec<String>>();
            let mut last_key = String::new();

            for (index, key) in data.iter().enumerate() {
                if key == "#" {
                    last_key = data[index + 1].to_string();
                    map.insert(last_key.to_string(), Value::from(Map::new()));
                }

                if !last_key.is_empty() && key.contains(':') {
                    let kv = key
                        .split(':')
                        .map(|item| item.to_string())
                        .collect::<Vec<String>>();

                    map.entry(&last_key).and_modify(|map| {
                        let mut m = map.as_object().unwrap().clone();
                        m.insert(kv[0].clone(), Value::from(kv[1].clone()));
                        *map = Value::from(m.clone());
                    });
                }
            }

            response.push(serde_json::to_string(&map)?)
        }

        Ok(response)
    }

    pub async fn create_key(
        &self,
        key_name: String,
        key_type: String,
        ttl: i64,
        abs: bool,
    ) -> Result<Key, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let mut pipeline = redis::pipe();

        let expire_command = if abs { "PEXPIREAT" } else { "PEXPIRE" };
        let value: String;

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
            ttl: if ttl > 0 {
                if abs {
                    ttl
                } else {
                    get_timestamp() + ttl
                }
            } else {
                -1
            },
            key_type,
            value,
            is_new: true,
        })
    }

    pub async fn search_keys<F: Fn(Vec<Key>, u64)>(
        &self,
        pattern: String,
        cursor: u64,
        limit: Option<u64>,
        state: tauri::State<'_, AppState>,
        callback: F,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;

        let l = limit.unwrap_or(20);
        let mut done = false;
        let mut new_cursor = cursor;
        let mut count: u64 = 0;

        while !done {
            if !*state.is_searching.lock().unwrap() {
                println!("Process stopped");
                break;
            }

            let mut command = redis::cmd("SCAN");
            command.arg(new_cursor);
            command.arg("MATCH");
            command.arg(pattern.clone());
            command.arg("COUNT");
            command.arg(10);

            let (c, keys) = command.query::<(String, Vec<String>)>(&mut connection)?;
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

                count += response.len() as u64;
                callback(response, new_cursor);
            }

            done = new_cursor == 0 || count >= l;
        }

        Ok(())
    }

    pub async fn find_keys(
        &self,
        pattern: String,
        cursor: u64,
        limit: Option<u64>,
    ) -> Result<(Vec<Key>, u64), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;

        let mut new_cursor = cursor;
        let l = limit.unwrap_or(20);
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

        let mut pipeline = redis::pipe();

        for item in &items {
            pipeline.cmd("TYPE").arg(item);
        }

        let mut response = vec![];
        let key_types = pipeline.query::<Vec<String>>(&mut connection)?;

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

    pub async fn get_keys(
        &self,
        keys: Vec<String>,
    ) -> Result<Vec<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;

        let mut result: Vec<Key> = vec![];

        for key in keys {
            let mut key_type_cmd = redis::cmd("TYPE");
            key_type_cmd.arg(&key);

            let key_type = key_type_cmd.query::<String>(&mut connection)?;

            let value = match key_type.as_str() {
                "set" => set::get(&mut connection, key.as_str()),
                "zset" => zset::get(&mut connection, key.as_str()),
                "hash" => hash::get(&mut connection, key),
                "list" => list::get(&mut connection, key.as_str()),
                "string" => string::get(&mut connection, key),
                _ => {
                    let error = Box::<dyn std::error::Error>::from("The key could not be found");
                    Err(error)
                }
            };

            if let Some(v) = value? {
                result.push(v);
            }
        }

        Ok(result)
    }

    pub async fn count(&self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let command = redis::cmd("DBSIZE");
        let count = command.query::<usize>(&mut connection);

        Ok(count?)
    }

    pub async fn select_db(&mut self, index: i64) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        self.db_index = index;

        redis::cmd("SELECT")
            .arg(index)
            .query::<()>(&mut connection)?;

        Ok(())
    }

    pub async fn rm_keys(&self, keys: Vec<&str>) -> Result<(), Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        connection.del::<Vec<&str>, ()>(keys)?;
        Ok(())
    }

    pub async fn get_key(&self, key: String) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        let mut key_type_cmd = redis::cmd("TYPE");
        key_type_cmd.arg(&key);

        let key_type = key_type_cmd.query::<String>(&mut connection)?;

        match key_type.as_str() {
            "set" => set::get(&mut connection, key.as_str()),
            "zset" => zset::get(&mut connection, key.as_str()),
            "hash" => hash::get(&mut connection, key),
            "list" => list::get(&mut connection, key.as_str()),
            "string" => string::get(&mut connection, key),
            _ => {
                let error = Box::<dyn std::error::Error>::from("The key could not be found");
                Err(error)
            }
        }
    }

    pub async fn add_zset_member(
        &self,
        key: String,
        value: Option<ZSetKey>,
        old_value: Option<String>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;

        if let Some(v) = value {
            return zset::add_zset_member(&mut connection, key, v, old_value);
        };

        Ok(None)
    }

    pub async fn del_zset_member(
        &self,
        key: String,
        value: Option<String>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        zset::del_zset_member(&mut connection, key, value)
    }

    pub async fn add_set_member(
        &self,
        key: String,
        value: String,
        replace: Option<String>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        set::add_set_member(&mut connection, key, value, replace)
    }

    pub async fn del_set_member(
        &self,
        key: String,
        value: String,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        set::del_set_member(&mut connection, key, value)
    }

    pub async fn add_list_member(
        &self,
        key: String,
        value: String,
        replace: Option<u64>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        list::add_list_member(&mut connection, key, value, replace)
    }

    pub async fn del_list_member(
        &self,
        key: String,
        value: String,
        index: Option<u64>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        list::del_list_member(&mut connection, key, value, index)
    }

    pub async fn add_hash_member(
        &self,
        key: String,
        value: String,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        hash::add_member(&mut connection, key, value)
    }

    pub async fn del_hash_member(
        &self,
        key: String,
        value: String,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        hash::del_member(&mut connection, key, value)
    }

    pub async fn update_string(
        &self,
        key: String,
        value: String,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().await?;
        string::update_string(&mut connection, key, value)
    }
}
