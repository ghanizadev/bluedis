mod database_tests {
    use crate::database::*;
    use std::env;
    use std::time::Duration;
    use tokio::time::sleep;

    fn get_url() -> String {
        let host = match env::var("REDIS_HOST") {
            Ok(val) => val,
            Err(_e) => "localhost".to_string(),
        };

        let port = match env::var("REDIS_PORT") {
            Ok(val) => val,
            Err(_e) => "6379".to_string(),
        };

        let ssl = match env::var("REDIS_SSL") {
            Ok(_) => "s".to_string(),
            Err(_e) => "".to_string(),
        };

        format!("redis{}://{}:{}", ssl, host, port).to_string()
    }

    #[tokio::test]
    async fn it_should_check_connection() {
        let db = Database::new(get_url());
        let connection = db.check_connection().await.unwrap();

        assert_eq!(connection, true);
    }

    #[tokio::test]
    async fn it_should_connect_to_a_different_db() {
        let db = Database::new(get_url()).with_index(1);
        let connection = db.check_connection().await.unwrap();

        assert_eq!(connection, true);
    }

    #[tokio::test]
    async fn it_should_db_config() {
        let db = Database::new(get_url());
        let config = db.get_config().await.unwrap();

        assert_ne!(config.len(), 0)
    }

    #[tokio::test]
    async fn it_should_db_info() {
        let db = Database::new(get_url());
        let config = db.get_info().await.unwrap();

        assert_ne!(config.len(), 0)
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_change_ttl() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_create_with_ttl() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_search_keys() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_not_create() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_get_by_key_list() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_delete_by_key_list() {
        todo!()
    }

    #[tokio::test]
    #[ignore]
    async fn it_should_count() {
        todo!()
    }

    #[tokio::test]
    async fn it_should_create_hash() {
        let db = Database::new(get_url());
        db.create_key("test::hash::key".into(), "hash".into(), 0, false)
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::hash::key".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::hash::key");
        assert_eq!(key.value, "{\"key\":\"new hash value\"}");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "hash");
    }

    #[tokio::test]
    async fn it_should_change_hash_members() {
        let db = Database::new(get_url());
        db.create_key("test::hash::key_change".into(), "hash".into(), 0, false)
            .await
            .unwrap();

        db.add_hash_member(
            "test::hash::key_change".into(),
            "{\"key\":\"someKey\",\"value\":\"Some value here\"}".into(),
        )
        .await
        .unwrap();

        let mut key: Key =
            if let Some(k) = db.get_key("test::hash::key_change".into()).await.unwrap() {
                k
            } else {
                panic!("The key does not exist");
            };

        assert_eq!(key.key, "test::hash::key_change");
        assert_eq!(
            key.value,
            "{\"key\":\"new hash value\",\"someKey\":\"Some value here\"}"
        );
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "hash");

        db.del_hash_member("test::hash::key_change".into(), "key".into())
            .await
            .unwrap();

        key = if let Some(k) = db.get_key("test::hash::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::hash::key_change");
        assert_eq!(key.value, "{\"someKey\":\"Some value here\"}");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "hash");
    }

    #[tokio::test]
    async fn it_should_set_hash_ttl() {
        let db = Database::new(get_url());
        db.create_key("test::hash::key_ttl".into(), "hash".into(), 0, false)
            .await
            .unwrap();

        db.set_ttl("test::hash::key_ttl".into(), 300, Some(false))
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::hash::key_ttl".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::hash::key_ttl");
        assert_eq!(key.value, "{\"key\":\"new hash value\"}");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl > 0, true);
        assert_eq!(key.key_type, "hash");

        sleep(Duration::from_millis(400)).await;

        match db.get_key("test::hash::key_ttl".into()).await {
            Ok(_) => {
                panic!("The key did not expire after TTL");
            }
            Err(err) => {
                assert_eq!(err.to_string(), "The key could not be found");
            }
        };
    }

    #[tokio::test]
    async fn it_should_set_string() {
        let db = Database::new(get_url());
        db.create_key("test::string::key".into(), "string".into(), 0, false)
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::string::key".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::string::key");
        assert_eq!(key.value, "new string value");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "string");
    }

    #[tokio::test]
    async fn it_should_update_string() {
        let db = Database::new(get_url());
        db.create_key("test::string::key_change".into(), "string".into(), 0, false)
            .await
            .unwrap();

        let mut key: Key =
            if let Some(k) = db.get_key("test::string::key_change".into()).await.unwrap() {
                k
            } else {
                panic!("The key does not exist");
            };

        assert_eq!(key.key, "test::string::key_change");
        assert_eq!(key.value, "new string value");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "string");

        db.update_string("test::string::key_change".into(), "new value here".into())
            .await
            .unwrap();

        key = if let Some(k) = db.get_key("test::string::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::string::key_change");
        assert_eq!(key.value, "new value here");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "string");
    }

    #[tokio::test]
    async fn it_should_set_string_ttl() {
        let db = Database::new(get_url());
        db.create_key("test::string::key_ttl".into(), "string".into(), 0, false)
            .await
            .unwrap();

        db.set_ttl("test::string::key_ttl".into(), 300, Some(false))
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::string::key_ttl".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::string::key_ttl");
        assert_eq!(key.value, "new string value");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl > 0, true);
        assert_eq!(key.key_type, "string");

        sleep(Duration::from_millis(400)).await;

        match db.get_key("test::string::key_ttl".into()).await {
            Ok(_) => {
                panic!("The key did not expire after TTL");
            }
            Err(err) => {
                assert_eq!(err.to_string(), "The key could not be found");
            }
        };
    }

    #[tokio::test]
    async fn it_should_create_list() {
        let db = Database::new(get_url());
        db.create_key("test::list::key".into(), "list".into(), 0, false)
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::list::key".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key");
        assert_eq!(key.value, "[\"new list value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");
    }

    #[tokio::test]
    async fn it_should_change_list_member() {
        let db = Database::new(get_url());
        // Create List
        db.create_key("test::list::key_change".into(), "list".into(), 0, false)
            .await
            .unwrap();

        let mut key: Key =
            if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
                k
            } else {
                panic!("The key does not exist");
            };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(key.value, "[\"new list value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        // Add plain list value
        db.add_list_member(
            "test::list::key_change".into(),
            "new list member here".into(),
            None,
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(key.value, "[\"new list member here\",\"new list value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        //Replace list value
        db.add_list_member(
            "test::list::key_change".into(),
            "value replaced".into(),
            Some(0),
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(key.value, "[\"value replaced\",\"new list value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        // Delete first occurence
        db.add_list_member(
            "test::list::key_change".into(),
            "to not be deleted".into(),
            None,
        )
        .await
        .unwrap();

        db.add_list_member(
            "test::list::key_change".into(),
            "new list value".into(),
            None,
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(
            key.value,
            "[\"new list value\",\"to not be deleted\",\"value replaced\",\"new list value\"]"
        );
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        db.del_list_member(
            "test::list::key_change".into(),
            "new list value".into(),
            None,
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(
            key.value,
            "[\"to not be deleted\",\"value replaced\",\"new list value\"]"
        );
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        // Delete a specific occurence
        db.add_list_member(
            "test::list::key_change".into(),
            "to be deleted".into(),
            None,
        )
        .await
        .unwrap();

        db.add_list_member("test::list::key_change".into(), "first item".into(), None)
            .await
            .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(
            key.value,
            "[\"first item\",\"to be deleted\",\"to not be deleted\",\"value replaced\",\"new list value\"]"
        );
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");

        db.del_list_member(
            "test::list::key_change".into(),
            "to be deleted".into(),
            Some(1),
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::list::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::list::key_change");
        assert_eq!(
            key.value,
            "[\"first item\",\"to not be deleted\",\"value replaced\",\"new list value\"]"
        );
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "list");
    }

    #[tokio::test]
    async fn it_should_create_set() {
        let db = Database::new(get_url());
        db.create_key("test::set::key".into(), "set".into(), 0, false)
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::set::key".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::set::key");
        assert_eq!(key.value, "[\"new set value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "set");
    }

    #[tokio::test]
    async fn it_should_change_set_member() {
        let db = Database::new(get_url());
        db.create_key("test::set::key_change".into(), "set".into(), 0, false)
            .await
            .unwrap();

        let mut key: Key =
            if let Some(k) = db.get_key("test::set::key_change".into()).await.unwrap() {
                k
            } else {
                panic!("test::set::key_change");
            };

        assert_eq!(key.key, "test::set::key_change");
        assert_eq!(key.value, "[\"new set value\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "set");

        db.add_set_member(
            "test::set::key_change".into(),
            "a new value here".into(),
            None,
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::set::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("test::set::key_change");
        };

        assert_eq!(key.key, "test::set::key_change");
        assert_eq!(key.value.len(), 36);
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "set");

        db.del_set_member("test::set::key_change".into(), "new set value".into())
            .await
            .unwrap();

        key = if let Some(k) = db.get_key("test::set::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("test::set::key_change");
        };

        assert_eq!(key.key, "test::set::key_change");
        assert_eq!(key.value, "[\"a new value here\"]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "set");
    }

    #[tokio::test]
    async fn it_should_create_zset() {
        let db = Database::new(get_url());
        db.create_key("test::zset::key".into(), "zset".into(), 0, false)
            .await
            .unwrap();

        let key: Key = if let Some(k) = db.get_key("test::zset::key".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::zset::key");
        assert_eq!(key.value, "[{\"score\":100,\"value\":\"new zset value\"}]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "zset");
    }

    #[tokio::test]
    async fn it_should_change_zset_member() {
        let db = Database::new(get_url());
        db.create_key("test::zset::key_change".into(), "zset".into(), 0, false)
            .await
            .unwrap();

        let mut key: Key =
            if let Some(k) = db.get_key("test::zset::key_change".into()).await.unwrap() {
                k
            } else {
                panic!("The key does not exist");
            };

        assert_eq!(key.key, "test::zset::key_change");
        assert_eq!(key.value, "[{\"score\":100,\"value\":\"new zset value\"}]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "zset");

        db.add_zset_member(
            "test::zset::key_change".into(),
            Some(ZSetKey {
                score: 5001,
                value: "more than 5000".into(),
            }),
            None,
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::zset::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::zset::key_change");
        assert_eq!(key.value, "[{\"score\":100,\"value\":\"new zset value\"},{\"score\":5001,\"value\":\"more than 5000\"}]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "zset");

        db.del_zset_member(
            "test::zset::key_change".into(),
            Some("new zset value".into()),
        )
        .await
        .unwrap();

        key = if let Some(k) = db.get_key("test::zset::key_change".into()).await.unwrap() {
            k
        } else {
            panic!("The key does not exist");
        };

        assert_eq!(key.key, "test::zset::key_change");
        assert_eq!(key.value, "[{\"score\":5001,\"value\":\"more than 5000\"}]");
        assert_eq!(key.is_new, false);
        assert_eq!(key.ttl, -1);
        assert_eq!(key.key_type, "zset");
    }
}
