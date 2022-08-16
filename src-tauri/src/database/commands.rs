use crate::{Database, Key};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum Response {
    Single(FindSingleKeyResult),
    Collection(FindKeyCollectionResult),
}

#[derive(Serialize, Deserialize)]
pub enum DatabaseResponse {
    Response(Response),
    Error(String),
    Empty(()),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ConnectionResponse {
    Error(String),
    Success(bool),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum CountResponse {
    Error(String),
    Count(u32),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FindKey {
    pub(crate) cstr: String,
    pub(crate) pattern: Option<String>,
    pub(crate) cursor: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FindSingleKeyResult {
    key: Option<Key>,
    cursor: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FindKeyCollectionResult {
    keys: Vec<Key>,
    cursor: i32,
}

#[tauri::command]
pub async fn find_keys(cstr: String, pattern: String, cursor: i32) -> DatabaseResponse {
    let mut db = Database::new(cstr);
    let result = db.find_keys(pattern, cursor, None, |_, _| {});

    match result {
        Ok((keys, cursor)) => {
            DatabaseResponse::Response(Response::Collection(FindKeyCollectionResult {
                keys,
                cursor,
            }))
        }
        Err(err) => DatabaseResponse::Error(format!("Failed to find keys, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn handle(
    cstr: String,
    key: String,
    action: String,
    key_type: String,
    args: Vec<String>,
) -> DatabaseResponse {
    let mut db = Database::new(cstr);
    let k = if key_type.is_empty() {
        None
    } else {
        Some(key_type)
    };

    let a: Vec<&str> = args.iter().map(AsRef::as_ref).collect();
    let result = db.handle(key.as_str(), action.as_str(), k, Some(a));

    match result {
        Ok(key) => {
            DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
        }
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn db_count(cstr: String) -> CountResponse {
    let mut db = Database::new(cstr);
    let result = db.count();

    match result {
        Ok(data) => CountResponse::Count(data as u32),
        Err(err) => CountResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn authenticate(cstr: String) -> ConnectionResponse {
    let mut db = Database::new(cstr);
    let result = db.check_connection();

    match result {
        Ok(data) => ConnectionResponse::Success(data),
        Err(err) => ConnectionResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn rm_keys(cstr: String, keys: Vec<String>) -> DatabaseResponse {
    let mut db = Database::new(cstr);
    let result = db.rm_keys(keys.iter().map(AsRef::as_ref).collect());

    match result {
        Ok(_) => DatabaseResponse::Empty(()),
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn select_db(cstr: String, db_index: i64) -> DatabaseResponse {
    let mut db = Database::new(cstr);
    let result = db.select_db(db_index);

    match result {
        Ok(_) => DatabaseResponse::Empty(()),
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}
