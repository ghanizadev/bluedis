mod state_tests {
    use crate::state::AppState;

    #[test]
    fn it_create_store() {
        let store = AppState::new();

        *store.db_index.lock().unwrap() = 0_i64;
        *store.is_connected.lock().unwrap() = true;
        *store.connection_string.lock().unwrap() = "redis://localhost:6379".into();
        *store.is_searching.lock().unwrap() = false;

        assert_eq!(*store.is_connected.lock().unwrap(), true);
        assert_eq!(
            *store.connection_string.lock().unwrap(),
            String::from("redis://localhost:6379")
        );
        assert_eq!(*store.is_searching.lock().unwrap(), false);
        assert_eq!(*store.db_index.lock().unwrap(), 0_i64);
    }
}
