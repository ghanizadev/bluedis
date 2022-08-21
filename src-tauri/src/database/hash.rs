use crate::{database::Key, helper::get_timestamp};
use redis::Connection;
use serde_json::{Map, Value};

fn marshall(data: Vec<String>) -> Result<String, Box<dyn std::error::Error>> {
    let mut map = Map::new();
    let mut i = 0;

    while i < data.len() {
        if i % 2 == 0 {
            map.insert(data[i].clone(), Value::String(data[i + 1].clone()));
        }

        i += 1;
    }

    let response = serde_json::to_string::<Map<String, Value>>(&map)?;

    Ok(response)
}

fn unmarshall(data: String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let value = serde_json::from_str::<Map<String, Value>>(&data)?;
    let mut result: Vec<&str> = vec![];

    for (_, value) in value.iter() {
        match value.as_str() {
            Some(value) => result.push(value),
            _ => {}
        }
    }

    Ok(result.iter().map(|v| v.to_string()).collect())
}

pub fn get(
    connection: &mut Connection,
    key: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    pipeline.cmd("HGETALL").arg(&key);
    pipeline.cmd("PTTL").arg(&key);

    let (result, pttl) = pipeline.query::<(Vec<String>, i64)>(connection)?;

    if result.is_empty() {
        Ok(None)
    } else {
        Ok(Some(Key {
            key: key.into(),
            value: marshall(result)?,
            is_new: false,
            key_type: "hash".into(),
            ttl: if pttl >= 0 {
                pttl + get_timestamp()
            } else {
                pttl
            },
        }))
    }
}

pub fn add_member(
    connection: &mut Connection,
    key: String,
    value: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let data = unmarshall(value.clone())?;
    let mut command = redis::cmd("HSET");

    command.arg(&key);

    for d in data {
        command.arg(d);
    }

    command.query::<()>(connection)?;

    get(connection, key.clone())
}

pub fn del_member(
    connection: &mut Connection,
    key: String,
    value: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("HDEL");
    command.arg(&key);
    command.arg(&value);

    command.query::<()>(connection)?;

    get(connection, key)
}
