#[cfg(test)]
mod tests {
    use crate::data_pack::*;

    fn manifest_json(overrides: &str) -> String {
        let base = r#"{
            "id": "test",
            "name_key": "pack.test.name",
            "version": "1.0.0",
            "type": "mod",
            "description_key": "pack.test.description",
            "author": "tester",
            "game_version": "1.0.0"
        }"#;
        let mut value: serde_json::Value = serde_json::from_str(base).unwrap();
        let overrides: serde_json::Value = serde_json::from_str(overrides).unwrap();
        value
            .as_object_mut()
            .unwrap()
            .extend(overrides.as_object().unwrap().clone());
        serde_json::to_string(&value).unwrap()
    }

    #[test]
    fn parse_valid_manifest() {
        let json = manifest_json(r#"{}"#);
        let manifest = parse_manifest(&json).unwrap();

        assert_eq!(manifest.id, "test");
        assert_eq!(manifest.name_key, "pack.test.name");
        assert_eq!(manifest.pack_type, PackType::Mod);
        assert_eq!(manifest.version, "1.0.0");
        assert_eq!(manifest.game_version, "1.0.0");
        assert_eq!(manifest.author, "tester");
        assert_eq!(manifest.description_key, "pack.test.description");
        assert!(manifest.tags.is_empty());
        assert!(manifest.dependencies.is_empty());
    }

    #[test]
    fn parse_manifest_rejects_invalid_id() {
        let json = manifest_json(r#"{"id": "Bad-Id"}"#);
        let err = parse_manifest(&json).unwrap_err();
        let msg = format!("{err}");
        assert!(msg.contains("id"), "expected error about id, got: {msg}");
    }

    #[test]
    fn parse_manifest_rejects_invalid_version() {
        let json = manifest_json(r#"{"version": "not.a.version"}"#);
        assert!(parse_manifest(&json).is_err());
    }

    #[test]
    fn parse_manifest_rejects_invalid_game_version() {
        let json = manifest_json(r#"{"game_version": "abc"}"#);
        let err = parse_manifest(&json).unwrap_err();
        let msg = format!("{err}");
        assert!(
            msg.contains("game_version"),
            "expected error about game_version, got: {msg}"
        );
    }

    #[test]
    fn parse_manifest_validates_dependencies() {
        let json = manifest_json(r#"{"dependencies": ["Bad!!"]}"#);
        assert!(parse_manifest(&json).is_err());
    }

    #[test]
    fn parse_manifest_accepts_all_pack_types() {
        for (type_str, expected) in [
            ("base", PackType::Base),
            ("dlc", PackType::Dlc),
            ("mod", PackType::Mod),
        ] {
            let json = manifest_json(&format!(r#"{{"type": "{type_str}"}}"#));
            let manifest = parse_manifest(&json).unwrap();
            assert_eq!(manifest.pack_type, expected);
        }
    }

    #[test]
    fn parse_manifest_rejects_unknown_type() {
        let json = r#"{
            "id": "test",
            "name_key": "pack.test.name",
            "version": "1.0.0",
            "type": "expansion",
            "description_key": "pack.test.description",
            "author": "test",
            "game_version": "1.0.0"
        }"#;
        assert!(parse_manifest(json).is_err());
    }
}
