use serde::{Deserialize, Serialize};

use crate::persistence::Favorite;
use crate::{Persistence, Preference};

#[derive(Serialize, Deserialize, Debug)]
pub enum PreferenceResponse {
    Error(String),
    Success(Preference),
    Empty(()),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum FavoriteResponse {
    Error(String),
    Single(Favorite),
    Collection(Vec<Favorite>),
    Empty(()),
}

#[tauri::command]
pub async fn load_preference() -> PreferenceResponse {
    let persistence = Persistence::new();
    let result = persistence.get_preferences();

    match result {
        Err(err) => {
            PreferenceResponse::Error(format!("Failed to load preferences, reason: {:?}", err))
        }
        Ok(pref) => PreferenceResponse::Success(pref),
    }
}

#[tauri::command]
pub async fn save_preference(pref: Preference) -> PreferenceResponse {
    let persistence = Persistence::new();
    let result = persistence.save_preferences(pref);

    match result {
        Err(err) => {
            PreferenceResponse::Error(format!("Failed to save preferences, reason: {:?}", err))
        }
        _ => PreferenceResponse::Empty(()),
    }
}

#[tauri::command]
pub async fn save_favorite(fav: Favorite) -> FavoriteResponse {
    let persistence = Persistence::new();
    let result = persistence.save_favorite(fav);

    match result {
        Err(err) => FavoriteResponse::Error(format!("Failed to save favorite, reason: {:?}", err)),
        _ => FavoriteResponse::Empty(()),
    }
}

#[tauri::command]
pub async fn get_all_favorites() -> FavoriteResponse {
    let persistence = Persistence::new();
    let result = persistence.get_all_favorites();

    match result {
        Err(err) => {
            FavoriteResponse::Error(format!("Failed to load your favorites, reason: {:?}", err))
        }
        Ok(favorites) => FavoriteResponse::Collection(favorites),
    }
}

#[tauri::command]
pub async fn get_favorite(id: u32) -> FavoriteResponse {
    let persistence = Persistence::new();
    let result = persistence.get_favorite(id);

    match result {
        Err(err) => {
            FavoriteResponse::Error(format!("Failed to load your favorite, reason: {:?}", err))
        }
        Ok(favorite) => match favorite {
            None => FavoriteResponse::Empty(()),
            Some(fav) => FavoriteResponse::Single(fav),
        },
    }
}

#[tauri::command]
pub async fn del_favorite(id: String) -> FavoriteResponse {
    let persistence = Persistence::new();
    let result = persistence.del_favorite(id);

    match result {
        Err(err) => {
            FavoriteResponse::Error(format!("Failed to remove favorite, reason: {:?}", err))
        }
        _ => FavoriteResponse::Empty(()),
    }
}

#[tauri::command]
pub async fn wipe_data() -> PreferenceResponse {
    let persistence = Persistence::new();
    let result = persistence.wipe_data();

    match result {
        Err(err) => PreferenceResponse::Error(format!(
            "Failed to clear your preferences, reason: {:?}",
            err
        )),
        _ => PreferenceResponse::Empty(()),
    }
}
