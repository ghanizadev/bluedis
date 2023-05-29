mod persistence_tests {
    use crate::persistence::{Favorite, Persistence, Preference};
    use uuid::Uuid;

    fn get_test_data() -> (Favorite, Favorite, Favorite, Favorite) {
        let favorite_a: Favorite = Favorite {
            id: "0".to_string(),
            host: "host_a".to_string(),
            name: Some("Connection Name".to_string()),
            tls: true,
            password: Some("".to_string()),
            port: 6379,
        };

        let favorite_b: Favorite = Favorite {
            id: "1".to_string(),
            host: "host_b".to_string(),
            name: None,
            tls: false,
            password: Some("abc1234".to_string()),
            port: 63790,
        };

        let favorite_c: Favorite = Favorite {
            id: "2".to_string(),
            host: "host_c".to_string(),
            name: Some("Favorite C".to_string()),
            tls: true,
            password: Some("0000".to_string()),
            port: 1550,
        };

        let favorite_d: Favorite = Favorite {
            id: "3".to_string(),
            host: "host_d".to_string(),
            name: None,
            tls: true,
            password: Some("abc12345".to_string()),
            port: 1234,
        };

        (favorite_a, favorite_b, favorite_c, favorite_d)
    }

    #[test]
    fn it_should_save_preferences() {
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();
        let persistence = Persistence::new(Some(test_uid));

        let preferences = Preference {
            id: 0,
            dark_mode: true,
            font_name: "font_name".to_string(),
            font_size: 8,
            language: 0,
        };

        persistence.save_preferences(preferences.clone()).unwrap();

        let found_pref = persistence.get_preferences().unwrap();

        assert_eq!(preferences, found_pref);
    }

    #[test]
    fn it_should_save_favorites() {
        let (_, favorite_b, favorite_c, _) = get_test_data();
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();

        let persistence = Persistence::new(Some(test_uid));

        persistence.save_favorite(favorite_c.clone()).unwrap();
        persistence.save_favorite(favorite_b.clone()).unwrap();

        let found_favs = persistence.get_all_favorites().unwrap();

        assert_eq!(found_favs.len(), 2);
    }

    #[test]
    fn it_should_get_favorite() {
        let (favorite_a, favorite_b, _, favorite_d) = get_test_data();
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();

        let persistence = Persistence::new(Some(test_uid));

        persistence.save_favorite(favorite_a.clone()).unwrap();
        persistence.save_favorite(favorite_b.clone()).unwrap();
        persistence.save_favorite(favorite_d.clone()).unwrap();

        let found_fav = persistence.get_favorite(3).unwrap().unwrap();
        let found_favs = persistence.get_all_favorites().unwrap();

        assert_eq!(found_favs.len(), 3);
        assert_eq!(favorite_d.clone(), found_fav);
    }

    #[test]
    fn it_should_get_all_favorites() {
        let (favorite_a, favorite_b, favorite_c, favorite_d) = get_test_data();
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();

        let persistence = Persistence::new(Some(test_uid));

        persistence.save_favorite(favorite_a.clone()).unwrap();
        persistence.save_favorite(favorite_b.clone()).unwrap();
        persistence.save_favorite(favorite_c.clone()).unwrap();
        persistence.save_favorite(favorite_d.clone()).unwrap();

        let found_favs = persistence.get_all_favorites().unwrap();

        assert_eq!(favorite_a.clone(), found_favs[0]);
        assert_eq!(favorite_b.clone(), found_favs[1]);
        assert_eq!(favorite_c.clone(), found_favs[2]);
        assert_eq!(favorite_d.clone(), found_favs[3]);
    }

    #[test]
    fn it_should_delete_favorite() {
        let (favorite_a, favorite_b, favorite_c, favorite_d) = get_test_data();
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();

        let persistence = Persistence::new(Some(test_uid));

        persistence.save_favorite(favorite_a.clone()).unwrap();
        persistence.save_favorite(favorite_b.clone()).unwrap();
        persistence.save_favorite(favorite_c.clone()).unwrap();
        persistence.save_favorite(favorite_d.clone()).unwrap();

        let found_before = persistence.get_all_favorites().unwrap();

        assert_eq!(found_before.len(), 4);

        persistence.del_favorite("0".into()).unwrap();

        let found_after = persistence.get_all_favorites().unwrap();

        assert_eq!(found_after.len(), 3);
    }

    #[test]
    fn it_should_wipe_db() {
        let (favorite_a, favorite_b, favorite_c, favorite_d) = get_test_data();
        let test_uid = format!("test_{:?}", Uuid::new_v4()).to_string();

        let persistence = Persistence::new(Some(test_uid));

        let default_preference = Preference::new();

        persistence.save_favorite(favorite_a.clone()).unwrap();
        persistence.save_favorite(favorite_b.clone()).unwrap();
        persistence.save_favorite(favorite_c.clone()).unwrap();
        persistence.save_favorite(favorite_d.clone()).unwrap();

        let found_before = persistence.get_all_favorites().unwrap();

        assert_eq!(found_before.len(), 4);

        persistence.wipe_data().unwrap();

        let found_after = persistence.get_all_favorites().unwrap();
        let found_preferences = persistence.get_preferences().unwrap();

        assert_eq!(found_after.len(), 0);
        assert_eq!(found_preferences, default_preference);
    }
}
