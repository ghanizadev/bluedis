#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
mod persistence;

use crate::database::commands::FindKey;
use crate::database::{Database, Key};
use crate::persistence::{Persistence, Preference};
use serde_json::{json, Value};
use tauri::{Event, Manager};

fn main() {
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

                    let _ = db.find_keys(pattern, c, None, |key, cursor| {
                        main_window
                            .clone()
                            .emit::<Value>(
                                "data",
                                json!({
                                    "key": vec![key],
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
            database::commands::handle,
            database::commands::rm_keys,
            database::commands::db_count,
            database::commands::authenticate,
            database::commands::select_db,
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
