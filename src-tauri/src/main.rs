#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod database;
use crate::database::{Database, Key};

#[tauri::command]
fn set_key(c_str: &str, key: &str, value: &str) {
  let mut db = Database::new(Some(c_str.to_string()));
  db.set_key(key, value);
}

#[tauri::command]
fn get_key(c_str: &str, key: &str) -> String {
  let mut db = Database::new(Some(c_str.to_string()));
  db.get_key::<String>(key).unwrap()
}

#[tauri::command]
fn create_zset(c_str: &str, key: &str) -> Option<Key> {
    let mut db = Database::new(Some(c_str.to_string()));
    let args: Vec<&str> = vec![];
    db.handle(key, "create", Some("zset".into()), Some(args)).unwrap()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        set_key,
        get_key,
        create_zset,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
