pub mod commands;
mod hash;
mod list;
mod set;
mod string;
mod zset;

use futures::future::join_all;
use redis::{
    parse_redis_url, Client, Commands, Connection, ConnectionAddr, ConnectionInfo, FromRedisValue,
    RedisConnectionInfo,
};
use serde::{Deserialize, Serialize};
use std::ops::Deref;
use std::thread::Thread;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Default, Clone, Serialize, Deserialize, Debug)]
pub struct Key {
    key: String,
    value: String,
    is_new: bool,
    ttl: i32,
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

    pub fn set_ttl(&mut self, key: &str, ttl: i128, absolute: Option<bool>) {
        let mut connection = self.get_connection().unwrap();

        if ttl < 0 {
            connection
                .persist::<&str, ()>(key)
                .expect("failed to persist");
        } else {
            match absolute {
                None => {
                    connection
                        .pexpire_at::<&str, i32>(key, ttl as usize)
                        .expect("failed to set ttl");
                }
                Some(is_abs) => {
                    if is_abs {
                        connection
                            .pexpire::<&str, i32>(key, ttl as usize)
                            .expect("failed to set ttl");
                    } else {
                        connection
                            .pexpire_at::<&str, i32>(key, ttl as usize)
                            .expect("failed to set ttl");
                    }
                }
            }
        }
    }

    pub fn get_ttl(&mut self, key: &str) -> i32 {
        let mut connection = self.get_connection().unwrap();

        let mut ttl = connection.ttl::<&str, i32>(key).expect("failed to fetch");
        let start = SystemTime::now();
        let now = start
            .duration_since(UNIX_EPOCH)
            .expect("failed to fetch timesramp");

        if ttl > 0 {
            ttl += now.as_millis() as i32;
        }

        ttl
    }

    pub fn remove(&mut self, keys: Vec<&str>) {
        let mut connection = self.get_connection().unwrap();

        for key in keys {
            connection.del::<&str, ()>(key).expect("failed to delete");
        }
    }

    pub async fn get_type(&self, key: String) -> Result<String, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection().unwrap();

        let mut command = redis::cmd("TYPE");
        command.arg(key);

        let k_type = command.query::<String>(&mut connection)?;

        println!("{:?}", &k_type);

        Ok(k_type)
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

            done = new_cursor == 0 || keys.len() as u64 >= l;

            callback(response, new_cursor);
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

        for key in keys {
            connection.del::<&str, ()>(key)?;
        }

        Ok(())
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

    fn switch_string(
        &mut self,
        connection: &mut Connection,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => string::get(self.clone(), connection, key, args),
            "set" => string::set(self.clone(), connection, key, args),
            "del" => string::del(self.clone(), connection, key, args),
            "create" => string::del(self.clone(), connection, key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    fn switch_set(
        &mut self,
        connection: &mut Connection,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => set::get(self.clone(), connection, key, args),
            "set" => set::set(self.clone(), connection, key, args),
            "del" => set::del(self.clone(), connection, key, args),
            "create" => set::create(self.clone(), connection, key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    fn switch_zset(
        &mut self,
        connection: &mut Connection,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => zset::get(self.clone(), connection, key, args),
            "set" => zset::set(self.clone(), connection, key, args),
            "del" => zset::del(self.clone(), connection, key, args),
            "create" => zset::create(self.clone(), connection, key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    fn switch_list(
        &mut self,
        connection: &mut Connection,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => list::get(self.clone(), connection, key, args),
            "set" => list::set(self.clone(), connection, key, args),
            "del" => list::del(self.clone(), connection, key, args),
            "create" => list::create(self.clone(), connection, key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    fn switch_hash(
        &mut self,
        connection: &mut Connection,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => hash::get(self.clone(), connection, key, args),
            "set" => hash::set(self.clone(), connection, key, args),
            "del" => hash::del(self.clone(), connection, key, args),
            "create" => hash::create(self.clone(), connection, key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    // pub fn handle(
    //     &mut self,
    //     key: &str,
    //     action: &str,
    //     key_type: Option<String>,
    //     args: Option<Vec<&str>>,
    // ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    //     let mut connection = self.get_connection()?;
    //     let kt = match key_type {
    //         None => redis::cmd("TYPE")
    //             .arg(key)
    //             .query::<String>(&mut connection)?,
    //         Some(k_type) => k_type,
    //     };
    //     let local_args = match args {
    //         None => {
    //             vec![]
    //         }
    //         Some(a) => a,
    //     };
    //
    //     match kt.as_str() {
    //         "string" => self.switch_string(key, action, local_args),
    //         "set" => self.switch_set(key, action, local_args),
    //         "zset" => self.switch_zset(key, action, local_args),
    //         "list" => self.switch_list(key, action, local_args),
    //         "hash" => self.switch_hash(key, action, local_args),
    //         _ => {
    //             let error = Box::<dyn std::error::Error>::from(format!(
    //                 "The key {} does not exist or it is already expired",
    //                 key
    //             ));
    //             Err(error)
    //         }
    //     }
    // }

    pub async fn handle(
        &mut self,
        key: String,
        action: &str,
        key_type: Option<String>,
        args: Option<Vec<&str>>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        self.handle_with_connection(&mut connection, key, action, key_type, args.clone())
            .await
    }

    async fn handle_with_connection(
        &mut self,
        connection: &mut Connection,
        key: String,
        action: &str,
        key_type: Option<String>,
        args: Option<Vec<&str>>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let kt = match key_type {
            None => redis::cmd("TYPE").arg(&key).query::<String>(connection)?,
            Some(k_type) => k_type,
        };
        let local_args = match args {
            None => {
                vec![]
            }
            Some(a) => a,
        };

        match kt.as_str() {
            "string" => self.switch_string(connection, &key.as_str(), action, local_args),
            "set" => self.switch_set(connection, &key.as_str(), action, local_args),
            "zset" => self.switch_zset(connection, &key.as_str(), action, local_args),
            "list" => self.switch_list(connection, &key.as_str(), action, local_args),
            "hash" => self.switch_hash(connection, &key.as_str(), action, local_args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The key {} does not exist or it is already expired",
                    key
                ));
                Err(error)
            }
        }
    }
}
