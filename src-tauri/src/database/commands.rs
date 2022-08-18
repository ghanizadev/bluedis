use crate::database::zset::ZSetKey;
use crate::state::{AppState};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::Window;

use super::{Database, Key};

#[derive(Serialize, Deserialize)]
pub enum Response {
    Created(Key),
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
    pub(crate) cursor: Option<u64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FindSingleKeyResult {
    key: Option<Key>,
    cursor: u64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FindKeyCollectionResult {
    keys: Vec<Key>,
    cursor: u64,
}

#[tauri::command]
pub async fn find_keys(pattern: String, cursor: u64, state: tauri::State<'_, AppState>) -> Result<DatabaseResponse, ()> {
    let cstr = String::from(&*state.connection_string.lock().unwrap());
    let db_index = *state.db_index.lock().unwrap();

    let mut db = Database::new(cstr.clone()).with_index(db_index.clone());
    
    let result = db.find_keys(pattern, cursor, None);

    Ok(match result.await {
        Ok((keys, cursor)) => {
            DatabaseResponse::Response(Response::Collection(FindKeyCollectionResult {
                keys,
                cursor,
            }))
        }
        Err(err) => {
            DatabaseResponse::Error(format!("Failed to find keys, reason: {:?}", err))
        }
    })
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
pub async fn authenticate(cstr: String, state: tauri::State<'_, AppState>) -> Result<ConnectionResponse, ()> {
    let mut st = state.connection_string.lock().unwrap();
    *st = cstr.clone();
    
    let mut db = Database::new(cstr);
    let result = db.check_connection();

    Ok(match result {
        Ok(data) => ConnectionResponse::Success(data),
        Err(err) => ConnectionResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    })
}

#[tauri::command]
pub async fn disconnect() -> () {
    //TODO disconnect
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
pub async fn select_db(db_index: i64, state: tauri::State<'_, AppState>) -> Result<DatabaseResponse, ()> {
    let connection_str = state.connection_string.lock().unwrap();
    let mut db_i = state.db_index.lock().unwrap();

    *db_i = db_index;

    let mut db = Database::new(connection_str.to_string());
    let result = db.select_db(db_index);

    Ok(match result {
        Ok(_) => DatabaseResponse::Empty(()),
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    })
}

#[tauri::command]
pub async fn create_key(
    key_name: String,
    key_type: String,
    ttl: i64,
    abs: bool,
    state: tauri::State<'_, AppState>
) -> Result<DatabaseResponse, ()> {
    let connection_str = String::from(&*state.connection_string.lock().unwrap());
    let db_index = *state.db_index.lock().unwrap();

    let db = Database::new(connection_str.clone()).with_index(db_index.clone());
    let result = db.create_key(key_name, key_type, ttl, abs);

    Ok(match result.await {
        Ok(key) => DatabaseResponse::Response(Response::Created(key)),
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    })
}

#[tauri::command]
pub async fn get_key(key: String, state: tauri::State<'_, AppState>) -> Result<DatabaseResponse, ()> {
    let connection_str = String::from(&*state.connection_string.lock().unwrap());
    let db_index = *state.db_index.lock().unwrap();

    let db = Database::new(connection_str.to_string()).with_index(db_index.clone());
    let result = db.get_key(key);

    Ok(match result.await {
        Ok(key) => {
            DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
        }
        Err(err) => DatabaseResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    })
}

#[tauri::command]
pub async fn alter_zset(
    cstr: String,
    action: String,
    key: String,
    value: Option<ZSetKey>,
    old_value: Option<String>,
) -> DatabaseResponse {
    let db = Database::new(cstr);

    match action.as_str() {
        "del_member" => match db.del_zset_member(key, old_value).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed delete member, reason: {:?}", err)),
        },
        "add_member" => match db.add_zset_member(key, value, old_value).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed alter member, reason: {:?}", err)),
        },
        _ => DatabaseResponse::Error(format!("Invalid action, reason: {:?}", &action)),
    }
}

#[tauri::command]
pub async fn alter_set(
    cstr: String,
    action: String,
    key: String,
    value: String,
    replace: Option<String>,
) -> DatabaseResponse {
    let db = Database::new(cstr);

    match action.as_str() {
        "del_member" => match db.del_set_member(key, value).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed delete member, reason: {:?}", err)),
        },
        "add_member" => match db.add_set_member(key, value, replace).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed alter member, reason: {:?}", err)),
        },
        _ => DatabaseResponse::Error(format!("Invalid action, reason: {:?}", &action)),
    }
}

#[tauri::command]
pub async fn alter_list(
    cstr: String,
    action: String,
    key: String,
    value: String,
    replace: Option<u64>,
    index: Option<u64>,
) -> DatabaseResponse {
    let db = Database::new(cstr);

    match action.as_str() {
        "del_member" => match db.del_list_member(key, value, index).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed delete member, reason: {:?}", err)),
        },
        "add_member" => match db.add_list_member(key, value, replace).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed alter member, reason: {:?}", err)),
        },
        _ => DatabaseResponse::Error(format!("Invalid action, reason: {:?}", &action)),
    }
}

#[tauri::command]
pub async fn alter_hash(
    cstr: String,
    action: String,
    key: String,
    value: String,
) -> DatabaseResponse {
    let db = Database::new(cstr);

    match action.as_str() {
        "del_member" => match db.del_hash_member(key, value).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed delete member, reason: {:?}", err)),
        },
        "add_member" => match db.add_hash_member(key, value).await {
            Ok(key) => {
                DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
            }
            Err(err) => DatabaseResponse::Error(format!("Failed alter member, reason: {:?}", err)),
        },
        _ => DatabaseResponse::Error(format!("Invalid action, reason: {:?}", &action)),
    }
}

#[tauri::command]
pub async fn alter_string(cstr: String, key: String, value: String) -> DatabaseResponse {
    let db = Database::new(cstr);

    match db.update_string(key, value).await {
        Ok(key) => {
            DatabaseResponse::Response(Response::Single(FindSingleKeyResult { key, cursor: 0 }))
        }
        Err(err) => DatabaseResponse::Error(format!("Failed alter member, reason: {:?}", err)),
    }
}

#[tauri::command]
pub async fn search(cstr: String, pattern: Option<String>, cursor: Option<u64>, window: Window) -> () {
    let mut db = Database::new(cstr);

    let p = match pattern {
        Some(v) => v,
        _ => "*".to_string(),
    };

    let c = match cursor {
        Some(v) => v,
        _ => 0,
    };

    db.search_keys(p, c, None, |key, cursor| {
        window
            .emit::<Value>(
                "data",
                json!({
                    "key": key,
                    "cursor": cursor
                }),
            )
            .expect("TODO: panic message");
    })
    .expect("failed to search");
}

