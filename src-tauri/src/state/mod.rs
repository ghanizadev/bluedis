use std::sync::Mutex;

pub struct AppState {
    pub connection_string: Mutex<String>,
    pub is_connected: Mutex<bool>,
    pub db_index: Mutex<i64>,
}

impl AppState {
    pub fn new() -> Self {
        AppState { 
            connection_string: Mutex::new("".into()),
            is_connected: Mutex::new(false),
            db_index: Mutex::new(0),
        }
    }
}