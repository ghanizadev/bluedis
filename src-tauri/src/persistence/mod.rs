pub mod commands;

use std::path::{Path, PathBuf};

use rusqlite::{params, Connection, OptionalExtension, Result};
use serde::{Deserialize, Serialize};
use tauri::api::path::{resource_dir};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Preference {
    id: u8,
    dark_mode: bool,
    font_size: u8,
    font_name: String,
    language: u8,
}

impl Preference {
    pub fn new() -> Self {
        Preference {
            id: 0,
            dark_mode: false,
            font_size: 10,
            font_name: "JetBrains Mono".into(),
            language: 0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Favorite {
    id: String,
    name: Option<String>,
    host: String,
    port: u16,
    password: Option<String>,
    tls: bool,
}

pub struct Persistence {}

fn get_db_path() -> PathBuf {
    Path::new(".")
    .join("config")
}

impl Persistence {
    pub fn new() -> Self {
        let path = get_db_path();
        let c = Connection::open(path).unwrap();

        c.execute(
            "CREATE TABLE IF NOT EXISTS main.favorite (\
            id TEXT PRIMARY KEY,\
            name TEXT,\
            host TEXT,\
            port INTEGER,\
            password INTEGER,\
            tls INTEGER,\
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
        );",
            (),
        )
        .unwrap();

        c.execute(
            "CREATE TABLE IF NOT EXISTS main.preference (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            dark_mode INTEGER,\
            font_name TEXT,\
            font_size INTEGER,\
            language INTEGER
        );",
            (),
        )
        .unwrap();

        c.close().expect("failed to close connection");

        Persistence {}
    }

    pub fn get_preferences(&self) -> Result<Preference, Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        let preference = c
            .query_row(
                "SELECT id, dark_mode, font_name, font_size, language FROM main.preference",
                [],
                |row| {
                    Ok(Preference {
                        id: row.get(0)?,
                        dark_mode: row.get(1)?,
                        font_name: row.get(2)?,
                        font_size: row.get(3)?,
                        language: row.get(4)?,
                    })
                },
            )
            .optional()?;

        match preference {
            Some(p) => Ok(p),
            _ => Ok(Preference::new()),
        }
    }

    pub fn save_preferences(&self, pref: Preference) -> Result<(), Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        c.execute(
            "INSERT OR REPLACE INTO main.preference (id, dark_mode, font_name, font_size, language) VALUES (?1, ?2, ?3, ?4, ?5);",
            (
                &pref.id,
                &pref.dark_mode,
                &pref.font_name,
                &pref.font_size,
                &pref.language,
            ),
        )?;

        c.close().expect("failed to close connection");

        Ok(())
    }

    pub fn save_favorite(&self, fav: Favorite) -> Result<(), Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        c.execute(
            "INSERT OR REPLACE INTO main.favorite (id, name, host, port, password, tls) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![&fav.id, &fav.name, &fav.host, &fav.port, &fav.password, &fav.tls]
        )?;

        c.close().expect("failed to close connection");

        Ok(())
    }

    pub fn del_favorite(&self, id: String) -> Result<(), Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        c.execute("DELETE FROM main.favorite WHERE id = ?1", params![id])?;
        c.close().expect("failed to close connection");

        Ok(())
    }

    pub fn get_favorite(&self, id: u32) -> Result<Option<Favorite>, Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        let favorite = c
            .query_row(
                "SELECT id, name, host, port, password, tls FROM main.favorite WHERE id = ?",
                params![id],
                |row| {
                    Ok(Favorite {
                        id: row.get(0)?,
                        name: row.get(1)?,
                        host: row.get(2)?,
                        port: row.get(3)?,
                        password: row.get(4)?,
                        tls: row.get(5)?,
                    })
                },
            )
            .optional()?;

        Ok(favorite)
    }

    pub fn get_all_favorites(&self) -> Result<Vec<Favorite>, Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        let mut stmt =
            c.prepare("SELECT id, name, host, port, password, tls FROM main.favorite ORDER BY created_at")?;
        let iter = stmt.query_map([], |row| {
            Ok(Favorite {
                id: row.get(0)?,
                name: row.get(1)?,
                host: row.get(2)?,
                port: row.get(3)?,
                password: row.get(4)?,
                tls: row.get(5)?,
            })
        })?;

        let mut response: Vec<Favorite> = vec![];

        for fav in iter {
            if let Ok(f) = fav {
                response.push(f)
            }
        }

        Ok(response)
    }

    pub fn wipe_data(&self) -> Result<(), Box<dyn std::error::Error>> {
        let path = get_db_path();
        let c = Connection::open(path)?;

        c.execute("DROP TABLE IF EXISTS main.preference;", ())?;
        c.execute("DROP TABLE IF EXISTS main.favorite;", ())?;
        c.close().expect("failed to close connection");

        Ok(())
    }
}
