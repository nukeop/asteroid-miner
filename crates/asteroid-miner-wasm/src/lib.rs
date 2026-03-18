use asteroid_miner_defs::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
struct DataPackFiles {
    manifest: String,
    skills: String,
    traits: String,
    origins: String,
    careers: String,
}

fn load_data_pack_inner(files: &DataPackFiles) -> Result<Definitions, String> {
    parse_manifest(&files.manifest).map_err(|e| e.to_string())?;
    let skills = load_skills(&files.skills).map_err(|e| e.to_string())?;
    let traits = load_traits(&files.traits).map_err(|e| e.to_string())?;
    let origins = load_origins(&files.origins).map_err(|e| e.to_string())?;
    let careers = load_careers(&files.careers).map_err(|e| e.to_string())?;

    let mut defs = Definitions::new();
    load_into_definitions(&mut defs, skills, traits, origins, careers);
    Ok(defs)
}

#[wasm_bindgen]
pub fn load_data_pack(files: JsValue) -> Result<JsValue, String> {
    let files: DataPackFiles = serde_wasm_bindgen::from_value(files).map_err(|e| e.to_string())?;
    let defs = load_data_pack_inner(&files)?;
    let serializer = serde_wasm_bindgen::Serializer::new().serialize_maps_as_objects(true);
    defs.serialize(&serializer).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use asteroid_miner_types::*;

    use super::*;

    #[test]
    fn load_data_pack_parses_definitions_from_json() {
        let manifest = r#"{
            "id": "test", "name": "Test", "version": "1.0.0",
            "type": "base", "description": "test", "author": "test",
            "game_version": "0.1.0"
        }"#;
        let skills = r#"[{"id": "mining", "name": "Mining", "description": "Dig rocks", "xp_base": 100, "xp_growth": 1.5}]"#;
        let traits = r#"[{
            "id": "tough", "name": "Tough", "description": "Hard to kill",
            "skill_modifiers": [{"skill": "mining", "op": "Flat", "value": 5}],
            "custom_effects": [{"handler": "test_handler", "params": {"strength": 2}}]
        }]"#;
        let origins = r#"[{
            "id": "belter", "name": "Belter", "description": "Born in the belt",
            "skill_bonuses": [{"id": "mining", "amount": 3}]
        }]"#;
        let careers = r#"[{
            "id": "miner", "name": "Miner", "description": "Digs for a living",
            "skill_bonuses": [{"id": "mining", "amount": 2}]
        }]"#;

        let files = DataPackFiles {
            manifest: manifest.into(),
            skills: skills.into(),
            traits: traits.into(),
            origins: origins.into(),
            careers: careers.into(),
        };
        let defs = load_data_pack_inner(&files).unwrap();

        let skill = defs
            .skills
            .get(&SkillId("mining".into()))
            .expect("mining skill should exist");
        assert_eq!(skill.id.0, "mining");
        assert_eq!(skill.name, "Mining");
        assert_eq!(skill.description, "Dig rocks");
        assert_eq!(skill.xp_base, 100);
        assert_eq!(skill.xp_growth, 1.5);

        let tr = defs
            .traits
            .get(&TraitId("tough".into()))
            .expect("tough trait should exist");
        assert_eq!(tr.id.0, "tough");
        assert_eq!(tr.name, "Tough");
        assert_eq!(tr.description, "Hard to kill");
        assert_eq!(tr.skill_modifiers[0].skill.0, "mining");
        assert_eq!(tr.skill_modifiers[0].value, 5.0);
        assert_eq!(tr.custom_effects[0].handler, "test_handler");

        let origin = defs
            .origins
            .get(&OriginId("belter".into()))
            .expect("belter origin should exist");
        assert_eq!(origin.id.0, "belter");
        assert_eq!(origin.name, "Belter");
        assert_eq!(origin.description, "Born in the belt");
        assert_eq!(origin.skill_bonuses[0].id.0, "mining");
        assert_eq!(origin.skill_bonuses[0].amount, 3);

        let career = defs
            .careers
            .get(&CareerId("miner".into()))
            .expect("miner career should exist");
        assert_eq!(career.id.0, "miner");
        assert_eq!(career.name, "Miner");
        assert_eq!(career.description, "Digs for a living");
        assert_eq!(career.skill_bonuses[0].id.0, "mining");
        assert_eq!(career.skill_bonuses[0].amount, 2);
    }

    #[test]
    fn load_data_pack_returns_error_on_invalid_json() {
        let manifest = r#"{
            "id": "test", "name": "Test", "version": "1.0.0",
            "type": "base", "description": "test", "author": "test",
            "game_version": "0.1.0"
        }"#;
        let bad_skills = "not valid json [[[";
        let traits = "[]";
        let origins = "[]";
        let careers = "[]";

        let files = DataPackFiles {
            manifest: manifest.into(),
            skills: bad_skills.into(),
            traits: traits.into(),
            origins: origins.into(),
            careers: careers.into(),
        };
        let result = load_data_pack_inner(&files);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("JSON error"));
    }
}
