use crate::database::{Database, Key};
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
    let mut result: Vec<String> = vec![];

    for (key, value) in value.iter() {
        result.push(key.clone());
        result.push(value.to_string());
    }

    Ok(result)
}

pub fn get(
    mut db: Database,
    key: &str,
    _args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;
    let mut command = redis::cmd("HGETALL");
    command.arg(key);

    let result = command.query::<Vec<String>>(&mut connection)?;

    Ok(Some(Key {
        key: key.into(),
        value: marshall(result)?,
        is_new: false,
        ttl: db.get_ttl(key),
        key_type: "hash".into(),
    }))
}

pub fn set(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;
    let data = unmarshall(args[0].to_string());
    let mut command = redis::cmd("HSET");

    command.arg(key);

    for arg in data {
        command.arg(arg);
    }

    command.query::<()>(&mut connection)?;

    get(db, key, args)
}

pub fn del(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;
    let index_or_name = args[0];
    let mut command = redis::cmd("HDEL");
    command.arg(key);
    command.arg(index_or_name);

    command.query::<()>(&mut connection)?;

    Ok(None)
}

pub fn create(
    db: Database,
    key: &str,
    _args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    set(db, key, vec!["newProp", "new value"])
}
