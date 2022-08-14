mod hash;
mod list;
mod set;
mod string;
mod zset;

use redis::{Client, Commands, Connection, FromRedisValue};
use serde::{Deserialize, Serialize};
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
}

impl Database {
    pub fn new(connection_str: String) -> Database {
        Database {
            conn_str: connection_str.clone(),
        }
    }

    pub fn get_connection(&mut self) -> Result<Connection, Box<dyn std::error::Error>> {
        let c = Client::open(self.conn_str.clone())?;
        Ok(c.get_connection()?)
    }

    pub fn check_connection(&mut self) -> Result<bool, String> {
        let mut connection = self.get_connection().unwrap();
        let command = redis::cmd("PING");
        let result: String = command.query(&mut connection).unwrap();
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

    //@TODO Implement find
    pub fn find(&self) {}

    //@TODO Implement find keys
    pub fn find_keys<F: Fn(Key)>(
        &mut self,
        pattern: String,
        cursor: i32,
        limit: Option<u32>,
        callback: F,
    ) -> Result<Vec<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;

        let mut new_cursor = if cursor > 0 { cursor } else { -1 };
        let mut count: u32 = 0;
        let l = limit.unwrap_or(10);
        let mut response: Vec<Key> = vec![];

        while new_cursor != 0 && count <= l {
            if new_cursor == -1 {
                new_cursor = 0;
            }

            let mut command = redis::cmd("SCAN");
            command.arg(new_cursor);
            command.arg("MATCH");
            command.arg(pattern.clone());
            command.arg("COUNT");
            command.arg("10");

            let (c, r) = command.query::<(String, Vec<String>)>(&mut connection)?;
            new_cursor = match c.parse::<i32>() {
                Ok(c) => c,
                _ => new_cursor,
            };

            for k in r {
                let key = self.handle(k.as_str(), "get", None, Some(vec![]))?;

                if let Some(s) = key {
                    println!("ok key");

                    callback(s.clone());
                    response.push(s.clone());
                    count += 1;
                }
            }
        }

        Ok(response)
    }

    pub fn count(&mut self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let command = redis::cmd("DBSIZE");
        let count = command.query::<usize>(&mut connection);

        Ok(count?)
    }

    pub fn select_db(&mut self, index: u16) {
        let mut connection = self.get_connection().unwrap();
        redis::cmd("SELECTDB")
            .arg(index)
            .query::<()>(&mut connection)
            .expect("failed to select db");
    }

    pub fn rem_key(&mut self, key: &str) {
        let mut connection = self.get_connection().unwrap();
        connection.del::<&str, ()>(key).unwrap();
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
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => string::get(self.clone(), key, args),
            "set" => string::set(self.clone(), key, args),
            "del" => string::del(self.clone(), key, args),
            "create" => string::del(self.clone(), key, args),
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
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => set::get(self.clone(), key, args),
            "set" => set::set(self.clone(), key, args),
            "del" => set::del(self.clone(), key, args),
            "create" => set::create(self.clone(), key, args),
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
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => zset::get(self.clone(), key, args),
            "set" => zset::set(self.clone(), key, args),
            "del" => zset::del(self.clone(), key, args),
            "create" => zset::create(self.clone(), key, args),
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
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => list::get(self.clone(), key, args),
            "set" => list::set(self.clone(), key, args),
            "del" => list::del(self.clone(), key, args),
            "create" => list::create(self.clone(), key, args),
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
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        match action {
            "get" => hash::get(self.clone(), key, args),
            "set" => hash::set(self.clone(), key, args),
            "del" => hash::del(self.clone(), key, args),
            "create" => hash::create(self.clone(), key, args),
            _ => {
                let error = Box::<dyn std::error::Error>::from(format!(
                    "The action \"{}\" is not valid for the given type",
                    action
                ));
                Err(error)
            }
        }
    }

    pub fn handle(
        &mut self,
        key: &str,
        action: &str,
        key_type: Option<String>,
        args: Option<Vec<&str>>,
    ) -> Result<Option<Key>, Box<dyn std::error::Error>> {
        let mut connection = self.get_connection()?;
        let kt = match key_type {
            None => redis::cmd("TYPE")
                .arg(key)
                .query::<String>(&mut connection)?,
            Some(k_type) => k_type,
        };
        let local_args = match args {
            None => {
                vec![]
            }
            Some(a) => a,
        };

        match kt.as_str() {
            "string" => self.switch_string(key, action, local_args),
            "set" => self.switch_set(key, action, local_args),
            "zset" => self.switch_zset(key, action, local_args),
            "list" => self.switch_list(key, action, local_args),
            "hash" => self.switch_hash(key, action, local_args),
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
