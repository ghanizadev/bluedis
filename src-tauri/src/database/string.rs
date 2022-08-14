use crate::database::{Database, Key};

pub fn get(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();

    let mut command = redis::cmd("GET");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    Ok(Some(Key {
        key: key.to_string(),
        value: command.query::<String>(&mut connection).unwrap(),
        is_new: false,
        ttl: db.get_ttl(key),
        key_type: "string".into()
    }))
}

pub fn set(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();

    let exists = redis::cmd("SET").arg(key).query::<String>(&mut connection).unwrap();
    let mut command = redis::cmd("SET");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    Ok(Some(Key {
        key: key.to_string(),
        value: command.query::<String>(&mut connection).unwrap(),
        is_new: exists.is_empty(),
        ttl: db.get_ttl(key),
        key_type: "string".into()
    }))
}

pub fn del(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();

    let mut command = redis::cmd("DEL");
    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    command.query::<()>(&mut connection).unwrap();
    Ok(None)
}

pub fn create(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut new_args: Vec<&str> = vec![];

    new_args.push("value");

    for arg in args {
        new_args.push(arg);
    }

    set(db, key, new_args)
}