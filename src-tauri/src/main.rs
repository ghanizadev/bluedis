#![feature(future_join)]
#![feature(async_closure)]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
mod helper;
mod persistence;

use crate::database::commands::FindKey;
use crate::database::{Database, Key};
use crate::persistence::{Persistence, Preference};
use serde_json::{json, Value};
use tauri::{Event, Manager};

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            main_window
                .clone()
                .listen("find-keys", move |event: Event| {
                    let payload = event.payload().unwrap();
                    let value = serde_json::from_str::<FindKey>(payload).unwrap();

                    let mut db = Database::new(value.cstr);
                    let pattern = match value.pattern {
                        Some(v) => v,
                        _ => "*".to_string(),
                    };

                    let c = match value.cursor {
                        Some(v) => v,
                        _ => 0,
                    };

                    println!("invoked");

                    let _ = db.search_keys(pattern, c, None, |key, cursor| {
                        main_window
                            .clone()
                            .emit::<Value>(
                                "data",
                                json!({
                                    "key": key,
                                    "cursor": cursor
                                }),
                            )
                            .expect("TODO: panic message");
                    });
                });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            database::commands::find_keys,
            database::commands::rm_keys,
            database::commands::db_count,
            database::commands::authenticate,
            database::commands::select_db,
            database::commands::create_key,
            database::commands::get_key,
            database::commands::alter_zset,
            database::commands::alter_set,
            database::commands::alter_list,
            persistence::commands::save_preference,
            persistence::commands::load_preference,
            persistence::commands::get_favorite,
            persistence::commands::get_all_favorites,
            persistence::commands::save_favorite,
            persistence::commands::del_favorite,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
