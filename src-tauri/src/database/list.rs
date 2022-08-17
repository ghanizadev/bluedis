use crate::database::{Database, Key};
use crate::helper::get_timestamp;
use redis::Connection;
use uuid::Uuid;

pub fn get(
    connection: &mut Connection,
    key: &str,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    pipeline.cmd("LRANGE").arg(key).arg(0).arg(-1);
    pipeline.cmd("PTTL").arg(&key);

    let (result, pttl) = pipeline.query::<(Vec<String>, i64)>(connection)?;

    Ok(Some(Key {
        key: key.into(),
        value: serde_json::to_string(&result).unwrap_or_else(|_| "".into()),
        is_new: false,
        key_type: "list".into(),
        ttl: if pttl >= 0 {
            pttl + get_timestamp()
        } else {
            pttl
        },
    }))
}

pub fn del(
    mut _db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let to_remove = args[0];
    let mut command = redis::cmd("LREM");

    command.arg(key);
    command.arg("1");
    command.arg(to_remove);

    command.query::<()>(connection)?;

    Ok(None)
}

pub fn add_list_member(
    connection: &mut Connection,
    key: String,
    value: String,
    replace: Option<u64>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    if let Some(r) = replace {
        pipeline.cmd("LSET").arg(&key).arg(r).arg(&value);
    } else {
        pipeline.cmd("LPUSH").arg(&key).arg(&value);
    }

    pipeline.query::<()>(connection)?;

    get(connection, &key)
}

pub fn del_list_member(
    connection: &mut Connection,
    key: String,
    value: String,
    index: Option<u64>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut pipeline = redis::pipe();

    if let Some(i) = index {
        let to_remove = Uuid::new_v4();

        pipeline
            .cmd("LSET")
            .arg(&key)
            .arg(i)
            .arg(to_remove.to_string());

        pipeline
            .cmd("LREM")
            .arg(&key)
            .arg(1)
            .arg(to_remove.to_string());
    } else {
        pipeline.cmd("LREM").arg(&key).arg(1).arg(&value);
    }

    pipeline.query::<()>(connection)?;

    get(connection, &key)
}
