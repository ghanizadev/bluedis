use crate::database::{Database, Key};
use serde_json::{json, Value};

fn marshall(data: Vec<String>) -> String {
    let mut result: Value = json![{}];
    let mut i = 0;

    while i < data.len() {
        if i % 2 != 1 {
            result[data[i].to_string()] = data[i + 1].to_string().parse().unwrap();
        }

        i += 1;
    }

    serde_json::to_string::<Value>(&result).unwrap_or("".into())
}

fn unmarshall(data: String) -> Vec<String> {
    let value = json!(data);
    let mut result: Vec<String> = vec![];
    let vector = value.as_array().unwrap();
    let mut i = 0;

    while i < vector.len() {
        if i % 2 != 1 {
            result.push(vector[i].to_string());
            result.push(vector[i + 1].to_string());
        }

        i += 1;
    }

    result
}

pub fn get(mut db: Database, key: &str, _args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let mut command = redis::cmd("HGETALL");
    command.arg(key);

    let result = command.query::<Vec<String>>(&mut connection).unwrap();

    Ok(Some(Key {
        key: key.into(),
        value: marshall(result),
        is_new: false,
        ttl: db.get_ttl(key),
        key_type: "hash".into(),
    }))
}

pub fn set(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let data = unmarshall(args[0].to_string());
    let mut command = redis::cmd("HSET");

    command.arg(key);

    for arg in data {
        command.arg(arg);
    }

    command.query::<()>(&mut connection).unwrap();

    get(db, key, args)
}

pub fn del(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let index_or_name = args[0];
    let mut command = redis::cmd("HDEL");
    command.arg(key);
    command.arg(index_or_name);

    command.query::<()>(&mut connection).unwrap();

    Ok(None)
}

pub fn create(db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    set(db, key, vec!["newProp", "new value"])
}
