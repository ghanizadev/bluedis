use crate::database::{Database, Key};
use redis::Connection;

pub fn get(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("GET");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    Ok(Some(Key {
        key: key.to_string(),
        value: command.query::<String>(connection)?,
        is_new: false,
        ttl: db.get_ttl(key)?,
        key_type: "string".into(),
    }))
}

pub fn set(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let exists = redis::cmd("SET").arg(key).query::<String>(connection)?;
    let mut command = redis::cmd("SET");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    Ok(Some(Key {
        key: key.to_string(),
        value: command.query::<String>(connection)?,
        is_new: exists.is_empty(),
        ttl: db.get_ttl(key)?,
        key_type: "string".into(),
    }))
}

pub fn del(
    mut db: Database,
    connection: &mut Connection,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut command = redis::cmd("DEL");
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
    let mut new_args: Vec<&str> = vec![];

    new_args.push("value");

    for arg in args {
        new_args.push(arg);
    }

    set(db, connection, key, new_args)
}
