use crate::database::Key;
use crate::helper::get_timestamp;
use redis::Connection;
use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize)]
pub struct ZSetKey {
    pub(crate) score: i64,
    pub(crate) value: String,
}

pub fn marshall(data: Vec<String>) -> Result<String, Box<dyn std::error::Error>> {
    let mut i = 0;
    let mut result: Vec<ZSetKey> = vec![];

    while i < data.len() {
        if i % 2 != 1 {
            result.push(ZSetKey {
                value: data[i].clone(),
                score: data[i + 1].parse::<i64>()?,
            })
        }

        i += 1;
    }

    let response = serde_json::to_string(&result)?;

    Ok(response)
}

pub fn get(
    connection: &mut Connection,
    key: &str,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    pipeline
        .cmd("ZRANGE")
        .arg(key)
        .arg("0")
        .arg("-1")
        .arg("WITHSCORES");

    pipeline.cmd("PTTL").arg(key);

    let (value, pttl) = pipeline.query::<(Vec<String>, i64)>(connection)?;

    if value.is_empty() {
        Ok(None)
    } else {
        Ok(Some(Key {
            key: key.to_string(),
            value: marshall(value)?,
            is_new: false,
            key_type: "zset".to_string(),
            ttl: if pttl >= 0 {
                pttl + get_timestamp()
            } else {
                pttl
            },
        }))
    }
}

pub fn del_zset_member(
    connection: &mut Connection,
    key: String,
    value: Option<String>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("ZREM");

    if let Some(v) = value {
        command.arg(&key).arg(v);
        command.query::<()>(connection)?;
    }

    get(connection, &key)
}

pub fn add_zset_member(
    connection: &mut Connection,
    key: String,
    value: ZSetKey,
    old_value: Option<String>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    if let Some(v) = old_value {
        pipeline.cmd("ZREM").arg(&key).arg(v).ignore();
    }

    pipeline
        .cmd("ZADD")
        .arg(&key)
        .arg(value.score)
        .arg(value.value);

    pipeline.query::<()>(connection)?;

    get(connection, &key)
}
