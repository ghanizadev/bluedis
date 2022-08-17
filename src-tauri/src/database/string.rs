use crate::database::{Database, Key};
use crate::helper::get_timestamp;
use redis::Connection;

pub fn get(
    connection: &mut Connection,
    key: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    pipeline.cmd("GET").arg(&key);
    pipeline.cmd("PTTL").arg(&key);

    let (value, pttl) = pipeline.query::<(String, i64)>(connection)?;

    Ok(Some(Key {
        key: key.to_string(),
        value,
        is_new: false,
        key_type: "string".into(),
        ttl: if pttl >= 0 {
            pttl + get_timestamp()
        } else {
            pttl
        },
    }))
}

pub fn update_string(
    connection: &mut Connection,
    key: String,
    value: String,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("SET");
    command.arg(&key);
    command.arg(&value);

    command.query::<()>(connection)?;

    get(connection, key)
}
