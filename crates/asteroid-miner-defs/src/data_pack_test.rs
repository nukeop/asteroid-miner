mod tests {
    use asteroid_miner_types::*;

    use crate::data_pack::*;
    use crate::*;

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

    #[test]
    fn parse_dependency_required() {
        let dep = parse_dependency("base >= 1.0.0").unwrap();
        assert_eq!(dep.kind, DependencyKind::Required);
        assert_eq!(dep.pack_id, "base");
        let req = dep.version_req.unwrap();
        assert!(req.matches(&semver::Version::new(1, 0, 0)));
        assert!(req.matches(&semver::Version::new(2, 0, 0)));
        assert!(!req.matches(&semver::Version::new(0, 9, 0)));
    }

    #[test]
    fn parse_dependency_optional() {
        let dep = parse_dependency("? some_mod").unwrap();
        assert_eq!(dep.kind, DependencyKind::Optional);
        assert_eq!(dep.pack_id, "some_mod");
        assert!(dep.version_req.is_none());
    }

    #[test]
    fn parse_dependency_incompatible() {
        let dep = parse_dependency("! bad_mod >= 2.0.0").unwrap();
        assert_eq!(dep.kind, DependencyKind::Incompatible);
        assert_eq!(dep.pack_id, "bad_mod");
        let req = dep.version_req.unwrap();
        assert!(req.matches(&semver::Version::new(2, 0, 0)));
        assert!(!req.matches(&semver::Version::new(1, 9, 9)));
    }

    #[test]
    fn parse_dependency_id_only() {
        let dep = parse_dependency("base").unwrap();
        assert_eq!(dep.kind, DependencyKind::Required);
        assert_eq!(dep.pack_id, "base");
        assert!(dep.version_req.is_none());
    }

    #[test]
    fn parse_dependency_rejects_invalid() {
        assert!(parse_dependency("Bad String!!").is_err());
    }

    #[test]
    fn parse_dependency_all_operators() {
        let cases = [
            ("mod_a = 1.0.0", "="),
            ("mod_a > 1.0.0", ">"),
            ("mod_a >= 1.0.0", ">="),
            ("mod_a < 2.0.0", "<"),
            ("mod_a <= 2.0.0", "<="),
        ];
        for (input, expected_op) in cases {
            let dep =
                parse_dependency(input).unwrap_or_else(|e| panic!("failed on '{input}': {e}"));
            let req_str = dep.version_req.unwrap().to_string();
            assert!(
                req_str.contains(expected_op),
                "'{input}': expected '{expected_op}' in '{req_str}'"
            );
        }
    }

    #[test]
    fn parse_dependency_rejects_empty_string() {
        assert!(parse_dependency("").is_err());
    }

    #[test]
    fn parse_dependency_rejects_uppercase_id() {
        assert!(parse_dependency("Base >= 1.0.0").is_err());
    }

    #[test]
    fn parse_dependency_rejects_invalid_operator() {
        assert!(parse_dependency("mod_a >> 1.0.0").is_err());
    }

    #[test]
    fn parse_dependency_rejects_invalid_version() {
        assert!(parse_dependency("mod_a >= not.a.ver").is_err());
    }

    #[test]
    fn load_skills_from_json() {
        let json = r#"[
            {
                "id": "mining",
                "name_key": "skill.mining.name",
                "description_key": "skill.mining.description",
                "xp_base": 100,
                "xp_growth": 1.5
            },
            {
                "id": "cosmonautics",
                "name_key": "skill.cosmonautics.name",
                "description_key": "skill.cosmonautics.description",
                "xp_base": 120,
                "xp_growth": 1.4
            }
        ]"#;
        let skills = load_skills(json).unwrap();
        assert_eq!(skills.len(), 2);
        assert_eq!(skills[0].id, SkillId("mining".into()));
        assert_eq!(skills[0].name_key, "skill.mining.name");
        assert_eq!(skills[1].id, SkillId("cosmonautics".into()));
        assert_eq!(skills[1].xp_base, 120);
    }

    #[test]
    fn load_traits_with_optional_fields_omitted() {
        let json = r#"[
            {
                "id": "tough",
                "name_key": "trait.tough.name",
                "description_key": "trait.tough.description"
            }
        ]"#;
        let traits = load_traits(json).unwrap();
        assert_eq!(traits.len(), 1);
        assert_eq!(traits[0].id, TraitId("tough".into()));
        assert!(traits[0].skill_modifiers.is_empty());
        assert!(traits[0].custom_effects.is_empty());
    }

    #[test]
    fn load_into_definitions_populates_registries() {
        let mut defs = Definitions::new();

        load_into_definitions(
            &mut defs,
            vec![SkillDef {
                id: SkillId("mining".into()),
                name_key: "skill.mining.name".into(),
                description_key: "skill.mining.description".into(),
                xp_base: 100,
                xp_growth: 1.5,
            }],
            vec![TraitDef {
                id: TraitId("tough".into()),
                name_key: "trait.tough.name".into(),
                description_key: "trait.tough.description".into(),
                skill_modifiers: vec![],
                custom_effects: vec![],
            }],
            vec![OriginDef {
                id: OriginId("belter".into()),
                name_key: "origin.belter.name".into(),
                description_key: "origin.belter.description".into(),
                skill_bonuses: vec![],
            }],
            vec![CareerDef {
                id: CareerId("miner".into()),
                name_key: "career.miner.name".into(),
                description_key: "career.miner.description".into(),
                skill_bonuses: vec![],
            }],
            vec![TagDef {
                id: TagId("fuel".into()),
                name_key: "tag.fuel.name".into(),
            }],
            vec![ResourceDef {
                id: ResourceId("coal".into()),
                name_key: "resource.coal.name".into(),
                description_key: "resource.coal.description".into(),
                tags: vec![TagId("fuel".into())],
            }],
            vec![FormationDef {
                id: FormationId("coal_sandstone".into()),
                name_key: "formation.coal_sandstone.name".into(),
                description_key: "formation.coal_sandstone.description".into(),
                matrix_resource: ResourceId("sandstone".into()),
                embedded_resources: vec![EmbeddedResource {
                    resource: ResourceId("coal".into()),
                    probability: 1.0,
                    min_grade: 0.02,
                    max_grade: 0.10,
                }],
            }],
            vec![AsteroidTypeDef {
                id: AsteroidTypeId("c_type".into()),
                name_key: "asteroid_type.c_type.name".into(),
                description_key: "asteroid_type.c_type.description".into(),
                mass_classes: vec![MassClass {
                    id: "s".into(),
                    name_key: "mass_class.s.name".into(),
                    min_mass: 5000.0,
                    max_mass: 50000.0,
                    max_sites: 1,
                }],
                formations: vec![WeightedFormation {
                    formation: FormationId("coal_sandstone".into()),
                    weight: 5.0,
                    depth_bonus: 0.0,
                }],
            }],
        );

        assert_eq!(defs.skills.len(), 1);
        assert_eq!(defs.traits.len(), 1);
        assert_eq!(defs.origins.len(), 1);
        assert_eq!(defs.careers.len(), 1);
        assert_eq!(defs.tags.len(), 1);
        assert_eq!(defs.resources.len(), 1);
        assert_eq!(defs.formations.len(), 1);
        assert_eq!(defs.asteroid_types.len(), 1);

        assert_eq!(
            defs.skills.get(&SkillId("mining".into())).unwrap().name_key,
            "skill.mining.name"
        );
        assert_eq!(
            defs.tags.get(&TagId("fuel".into())).unwrap().name_key,
            "tag.fuel.name"
        );
        assert_eq!(
            defs.resources.get(&ResourceId("coal".into())).unwrap().tags[0],
            TagId("fuel".into())
        );
        assert_eq!(
            defs.formations
                .get(&FormationId("coal_sandstone".into()))
                .unwrap()
                .matrix_resource,
            ResourceId("sandstone".into())
        );
        assert_eq!(
            defs.asteroid_types
                .get(&AsteroidTypeId("c_type".into()))
                .unwrap()
                .mass_classes[0]
                .max_sites,
            1
        );
    }

    #[test]
    fn load_overwrites_existing_definitions() {
        let mut defs = Definitions::new();

        load_into_definitions(
            &mut defs,
            vec![SkillDef {
                id: SkillId("mining".into()),
                name_key: "skill.mining.name".into(),
                description_key: "skill.mining.description".into(),
                xp_base: 100,
                xp_growth: 1.5,
            }],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
        );

        load_into_definitions(
            &mut defs,
            vec![SkillDef {
                id: SkillId("mining".into()),
                name_key: "skill.mining.name.v2".into(),
                description_key: "skill.mining.description.v2".into(),
                xp_base: 200,
                xp_growth: 1.8,
            }],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
            vec![],
        );

        assert_eq!(defs.skills.len(), 1);
        let skill = defs.skills.get(&SkillId("mining".into())).unwrap();
        assert_eq!(skill.name_key, "skill.mining.name.v2");
        assert_eq!(skill.xp_base, 200);
    }
}
