use crate::database::{Database, Key};
use crate::helper::get_timestamp;
use redis::Connection;

pub fn get(
    connection: &mut Connection,
    key: &str,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::pipe();

    command.cmd("SMEMBERS").arg(key);
    command.cmd("PTTL").arg(&key);

    let (value, pttl) = command.query::<(Vec<String>, i64)>(connection)?;

    Ok(Some(Key {
        key: key.to_string(),
        value: serde_json::to_string(&value).expect("Failed to serialize"),
        is_new: true,
        key_type: "set".into(),
        ttl: if pttl >= 0 {
            pttl + get_timestamp()
        } else {
            pttl
        },
    }))
}

pub fn del_set_member(
    connection: &mut Connection,
    key: String,
    value: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();
    pipeline.cmd("SREM").arg(&key).arg(&value).ignore();
    pipeline.query::<()>(connection)?;

    get(connection, &key)
}

pub fn add_set_member(
    connection: &mut Connection,
    key: String,
    value: String,
    replace: Option<String>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    if let Some(r) = replace {
        pipeline.cmd("SREM").arg(&key).arg(r).ignore();
    }

    pipeline.cmd("SADD").arg(&key).arg(value).ignore();
    pipeline.query::<()>(connection)?;

    get(connection, &key)
}
