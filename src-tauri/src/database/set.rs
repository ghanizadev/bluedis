use crate::database::{Database, Key};
use redis::Connection;

pub fn get(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("SMEMBERS");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    let value = command.query::<Vec<String>>(connection)?;

    Ok(Some(Key {
        key: key.to_string(),
        value: serde_json::to_string(&value).expect("Failed to serialize"),
        is_new: true,
        ttl: db.get_ttl(key),
        key_type: "set".into(),
    }))
}

pub fn set(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("SADD");
    command.arg(key);

    if args.len() > 1 && args[1] == "true" {
        //If the second argument is true
    }

    for arg in args {
        command.arg(arg);
    }

    Ok(Some(Key {
        key: key.to_string(),
        value: command.query::<String>(connection)?,
        is_new: true,
        ttl: db.get_ttl(key),
        key_type: "set".into(),
    }))
}

pub fn del(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("SREM");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    command.query::<()>(connection)?;

    Ok(None)
}

pub fn create(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut local_args: Vec<&str> = vec![];
    local_args.push("new set value");

    for arg in args {
        local_args.push(arg);
    }

    set(db, connection, key, local_args)
}
