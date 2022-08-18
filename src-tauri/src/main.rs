#![feature(future_join)]
#![feature(async_closure)]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
mod helper;
mod persistence;
mod general;
mod state;

use crate::persistence::{Persistence, Preference};
use sys_locale::get_locale;

#[tokio::main]
async fn main() {
    let locale = get_locale().unwrap_or_else(|| String::from("en-US"));

    println!("Locale: {:?}", locale);

    tauri::Builder::default()
        .manage(state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            database::commands::find_keys,
            database::commands::rm_keys,
            database::commands::db_count,
            database::commands::authenticate,
            database::commands::disconnect,
            database::commands::select_db,
            database::commands::create_key,
            database::commands::get_key,
            database::commands::alter_zset,
            database::commands::alter_set,
            database::commands::alter_list,
            database::commands::alter_string,
            database::commands::alter_hash,
            database::commands::search,
            persistence::commands::save_preference,
            persistence::commands::load_preference,
            persistence::commands::get_favorite,
            persistence::commands::get_all_favorites,
            persistence::commands::save_favorite,
            persistence::commands::del_favorite,
            persistence::commands::wipe_data,
            general::commands::open_external,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
