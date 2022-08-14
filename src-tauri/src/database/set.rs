use crate::database::{Database, Key};

pub fn get(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;

    let mut command = redis::cmd("SMEMBERS");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    let value = command.query::<Vec<String>>(&mut connection)?;

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
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;

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
        value: command.query::<String>(&mut connection)?,
        is_new: true,
        ttl: db.get_ttl(key),
        key_type: "set".into(),
    }))
}

pub fn del(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;

    let mut command = redis::cmd("SREM");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    command.query::<()>(&mut connection)?;

    Ok(None)
}

pub fn create(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut local_args: Vec<&str> = vec![];
    local_args.push("new set value");

    for arg in args {
        local_args.push(arg);
    }

    set(db, key, local_args)
}
