mod hash;
mod list;
mod set;
mod string;
mod zset;

use redis::{Client, Commands, Connection, FromRedisValue};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Default, Serialize, Deserialize)]
pub struct Key {
    key: String,
    value: String,
    is_new: bool,
    ttl: i32,
    key_type: String,
}

#[derive(Default, Clone)]
pub struct Database {
    conn_str: Option<String>,
}

impl Database {
    pub fn new(connection_str: Option<String>) -> Database {
        Database {
            conn_str: Some(match connection_str {
                None => String::from("redis://localhost"),
                Some(c_str) => c_str.clone(),
            }),
        }
    }

    pub fn get_connection(&mut self) -> Connection {
        match self.conn_str.clone() {
            None => {
                let c = Client::open("redis://localhost").unwrap();
                c.get_connection().unwrap()
            }
            Some(c_str) => {
                let c = Client::open(c_str.clone()).unwrap();
                c.get_connection().unwrap()
            }
        }
    }

    pub fn check_connection(&mut self) -> Result<bool, String> {
        let mut connection = self.get_connection();
        let command = redis::cmd("PING");
        let result: String = command.query(&mut connection).unwrap();
        let mut is_connected = false;

        if result == "PONG" {
            is_connected = true;
        }

        Ok(is_connected)
    }

    pub fn set_ttl(&mut self, key: &str, ttl: i128, absolute: Option<bool>) {
        let mut connection = self.get_connection();

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
        let mut connection = self.get_connection();

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

    pub fn remove(&mut self, keys: [&str; 100]) {
        let mut connection = self.get_connection();

        for key in keys {
            connection.del::<&str, ()>(key).expect("failed to delete");
        }
    }

    //@TODO Implement find
    pub fn find(&self) {}

    //@TODO Implement find keys
    pub fn find_keys(&self) {}

    pub fn count(&mut self) -> Result<usize, String> {
        let mut connection = self.get_connection();
        let command = redis::cmd("DBSIZE");
        let count = command.query::<usize>(&mut connection);

        Ok(count.unwrap())
    }

    pub fn select_db(&mut self, index: u16) {
        let mut connection = self.get_connection();
        redis::cmd("SELECTDB")
            .arg(index)
            .query::<()>(&mut connection)
            .expect("failed to select db");
    }

    pub fn create_key(&mut self) {}

    pub fn get_key<T: FromRedisValue>(&mut self, key: &str) -> Result<T, String> {
        let mut connection = self.get_connection();
        let result = connection.get::<&str, T>(key).expect("failed to get key");
        Ok(result)
    }

    pub fn set_key(&mut self, key: &str, value: &str) {
        let mut connection = self.get_connection();
        connection
            .set::<&str, &str, ()>(key, value)
            .expect("failed to save");
    }

    pub fn rem_key(&mut self, key: &str) {
        let mut connection = self.get_connection();
        connection.del::<&str, ()>(key).unwrap();
    }

    pub fn command<T: FromRedisValue>(&mut self, comm: &str, args: Option<[&str; 32]>) -> T {
        let mut connection = self.get_connection();
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
    ) -> Result<Option<Key>, String> {
        match action {
            "get" => string::get(self.clone(), key, args),
            "set" => string::set(self.clone(), key, args),
            "del" => string::del(self.clone(), key, args),
            "create" => string::del(self.clone(), key, args),
            _ => {
                panic!("Method is not valid")
            }
        }
    }

    fn switch_set(
        &mut self,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, String> {
        match action {
            "get" => set::get(self.clone(), key, args),
            "set" => set::set(self.clone(), key, args),
            "del" => set::del(self.clone(), key, args),
            "create" => set::create(self.clone(), key, args),
            _ => {
                panic!("")
            }
        }
    }

    fn switch_zset(
        &mut self,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, String> {
        match action {
            "get" => zset::get(self.clone(), key, args),
            "set" => zset::set(self.clone(), key, args),
            "del" => zset::del(self.clone(), key, args),
            "create" => zset::create(self.clone(), key, args),
            _ => {
                panic!("")
            }
        }
    }

    fn switch_list(
        &mut self,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, String> {
        match action {
            "get" => list::get(self.clone(), key, args),
            "set" => list::set(self.clone(), key, args),
            "del" => list::del(self.clone(), key, args),
            "create" => list::create(self.clone(), key, args),
            _ => {
                panic!("")
            }
        }
    }

    fn switch_hash(
        &mut self,
        key: &str,
        action: &str,
        args: Vec<&str>,
    ) -> Result<Option<Key>, String> {
        match action {
            "get" => hash::get(self.clone(), key, args),
            "set" => hash::set(self.clone(), key, args),
            "del" => hash::del(self.clone(), key, args),
            "create" => hash::create(self.clone(), key, args),
            _ => {
                panic!("")
            }
        }
    }

    pub fn handle(
        &mut self,
        key: &str,
        action: &str,
        key_type: Option<String>,
        args: Option<Vec<&str>>,
    ) -> Result<Option<Key>, String> {
        let mut connection = self.get_connection();
        let kt = match key_type {
            None => redis::cmd("TYPE")
                .arg(key)
                .query::<String>(&mut connection)
                .unwrap(),
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
                panic!("The key {} does not exist or it is already expired", key)
            }
        }
    }
}
