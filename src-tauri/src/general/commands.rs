use tauri::Window;

#[tauri::command]
pub async fn open_external(window: Window, link: String) -> Option<String> {
    let result = window.eval(link.as_str());

    match result {
        _error => {
            return Some("The link could not be opened".to_string());
        }
    }
}

#[tauri::command]
async fn open_console(handle: tauri::AppHandle) {
    let console_window = tauri::WindowBuilder::new(
        &handle,
        "console", /* the unique window label */
        tauri::WindowUrl::App("index.html/#/console".parse().unwrap()),
    )
    .build()
    .unwrap();
}
