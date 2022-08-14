use crate::database::{Database, Key};
use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize)]
struct ZSetKey {
    score: i64,
    value: String,
}

fn marshall(data: Vec<String>) -> Result<String, Box<dyn std::error::Error>> {
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

fn unmarshall(str: String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let data: Vec<ZSetKey> = serde_json::from_str(&str)?;
    let mut result: Vec<String> = vec![];

    for key in data {
        result.push(key.score.to_string());
        result.push(key.value);
    }

    Ok(result)
}

pub fn get(
    mut db: Database,
    key: &str,
    _args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;

    let mut command = redis::cmd("ZRANGE");
    command.arg(key);
    command.arg("0");
    command.arg("-1");
    command.arg("WITHSCORES");

    let result = command.query::<Vec<String>>(&mut connection)?;

    Ok(Some(Key {
        key: key.to_string(),
        value: marshall(result)?,
        is_new: false,
        key_type: "zset".to_string(),
        ttl: db.get_ttl(key),
    }))
}

pub fn set(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;
    // let data = unmarshall(args[0].to_string())?;

    let mut command = redis::cmd("ZADD");
    command.arg(key);
    // command.arg("NX");

    for value in args.clone() {
        command.arg(value);
    }

    if args.len() > 1 {
        let old = args[1].to_string();
        redis::cmd("ZREM")
            .arg(key)
            .arg(old)
            .query::<()>(&mut connection)?;
    }

    command.query::<()>(&mut connection)?;

    get(db, key, vec![])
}

pub fn del(
    mut db: Database,
    key: &str,
    args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    let mut connection = db.get_connection()?;
    let old = args[0].to_string();

    redis::cmd("ZREM")
        .arg(key)
        .arg(old)
        .query::<()>(&mut connection)?;

    Ok(None)
}

pub fn create(
    db: Database,
    key: &str,
    _args: Vec<&str>,
) -> Result<Option<Key>, Box<dyn std::error::Error>> {
    set(db, key, vec!["100", "new zset value"])
}
