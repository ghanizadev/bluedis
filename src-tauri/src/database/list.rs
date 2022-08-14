use crate::database::{Database, Key};

pub fn get(mut db: Database, key: &str, _args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let mut command = redis::cmd("LRANGE");
    command.arg(key);
    command.arg("0");
    command.arg("-1");

    let result = command.query::<Vec<String>>(&mut connection).unwrap();

    Ok(Some(Key {
        key: key.into(),
        value: serde_json::to_string(&result).unwrap_or_else(|_| "".into()),
        is_new: false,
        ttl: db.get_ttl(key),
        key_type: "list".into(),
    }))
}

pub fn set(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let mut command = redis::cmd("RPUSH");

    //@TODO validate second arg (index 1) to see if it is an update instead

    command.arg(key);

    for arg in args {
        command.arg(arg);
    }

    command.query::<()>(&mut connection).unwrap();

    get(db, key, vec![])
}

pub fn del(mut db: Database, key: &str, args: Vec<&str>) -> Result<Option<Key>, String> {
    let mut connection = db.get_connection();
    let to_remove = args[0];
    let mut command = redis::cmd("LREM");

    command.arg(key);
    command.arg("1");
    command.arg(to_remove);

    command.query::<()>(&mut connection).unwrap();

    Ok(None)
}

pub fn create(db: Database, key: &str, _args: Vec<&str>) -> Result<Option<Key>, String> {
    set(db, key, vec!["new list item"])
}
