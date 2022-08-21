use std::time::{SystemTime, UNIX_EPOCH};

pub fn get_timestamp() -> i64 {
    let start = SystemTime::now();
    let now = start
        .duration_since(UNIX_EPOCH)
        .expect("failed to fetch timestamp");

    now.as_millis() as i64
}
