#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
use crate::database::{Database, Key};
use serde::{Deserialize, Serialize};
use tauri::{Event, Manager, Window};

#[derive(Serialize, Deserialize)]
enum Response {
    Single(Option<Key>),
    Collection(Vec<Key>),
}

#[derive(Serialize, Deserialize)]
enum DatabaseResponse {
    Response(Response),
    Error(String),
}

#[derive(Serialize, Deserialize, Debug)]
enum ConnectionResponse {
    Error(String),
    Success(bool),
}

#[derive(Serialize, Deserialize, Debug)]
struct FindKeys {
    cstr: String,
    pattern: Option<String>,
}

#[tauri::command]
fn create_zset(c_str: &str, key: &str) -> DatabaseResponse {
    let mut db = Database::new(c_str.to_string());
    let args: Vec<&str> = vec![];
    let result = db.handle(key, "create", Some("zset".into()), Some(args));

    match result {
        Ok(data) => DatabaseResponse::Response(Response::Single(data)),
        Err(err) => DatabaseResponse::Error(format!("Failed to create ZSET, reason: {:?}", err)),
    }
}

#[tauri::command]
fn find_keys(cstr: String, pattern: String) -> DatabaseResponse {
    let mut db = Database::new(cstr);
    let result = db.find_keys(pattern, 0, None, |_| {});

    match result {
        Ok(data) => DatabaseResponse::Response(Response::Collection(data)),
        Err(err) => DatabaseResponse::Error(format!("Failed to find keys, reason: {:?}", err)),
    }
}

#[tauri::command]
fn authenticate(cstr: String) -> ConnectionResponse {
    let mut db = Database::new(cstr);
    let result = db.check_connection();

    match result {
        Ok(data) => ConnectionResponse::Success(data),
        Err(err) => ConnectionResponse::Error(format!("Failed to connect, reason: {:?}", err)),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            main_window
                .clone()
                .listen("find-keys", move |event: Event| {
                    let payload = event.payload().unwrap();
                    let value = serde_json::from_str::<FindKeys>(payload).unwrap();

                    let mut db = Database::new(value.cstr);
                    let pattern = match value.pattern {
                        Some(v) => v,
                        _ => "*".to_string(),
                    };

                    let _ = db.find_keys(pattern, 0, None, |key| {
                        main_window
                            .clone()
                            .emit::<Vec<Key>>("data", vec![key])
                            .expect("TODO: panic message");
                    });
                });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_zset,
            find_keys,
            authenticate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
