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
    tags: String,
    resources: String,
    formations: String,
    asteroid_types: String,
    ship_modules: String,
    machines: String,
    names: String,
    scenarios: String,
}

fn load_data_pack_inner(files: &DataPackFiles) -> Result<Definitions, String> {
    parse_manifest(&files.manifest).map_err(|e| e.to_string())?;
    let skills = load_skills(&files.skills).map_err(|e| e.to_string())?;
    let traits = load_traits(&files.traits).map_err(|e| e.to_string())?;
    let origins = load_origins(&files.origins).map_err(|e| e.to_string())?;
    let careers = load_careers(&files.careers).map_err(|e| e.to_string())?;
    let tags = load_tags(&files.tags).map_err(|e| e.to_string())?;
    let resources = load_resources(&files.resources).map_err(|e| e.to_string())?;
    let formations = load_formations(&files.formations).map_err(|e| e.to_string())?;
    let asteroid_types = load_asteroid_types(&files.asteroid_types).map_err(|e| e.to_string())?;
    let ship_modules = load_ship_modules(&files.ship_modules).map_err(|e| e.to_string())?;
    let machines = load_machines(&files.machines).map_err(|e| e.to_string())?;
    let name_pool = load_name_pool(&files.names).map_err(|e| e.to_string())?;

    let mut defs = Definitions::new();
    load_into_definitions(
        &mut defs,
        skills,
        traits,
        origins,
        careers,
        tags,
        resources,
        formations,
        asteroid_types,
        ship_modules,
        machines,
        name_pool,
    );

    let scenarios = load_scenarios(&files.scenarios, &defs).map_err(|e| e.to_string())?;
    register_scenarios(&mut defs, scenarios);

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

    fn test_manifest() -> String {
        r#"{
            "id": "test", "name_key": "pack.test.name", "version": "1.0.0",
            "type": "base", "description_key": "pack.test.description", "author": "test",
            "game_version": "0.1.0"
        }"#
        .into()
    }

    fn test_files() -> DataPackFiles {
        DataPackFiles {
            manifest: test_manifest(),
            skills: r#"[{"id": "mining", "name_key": "skill.mining.name", "description_key": "skill.mining.description", "xp_base": 100, "xp_growth": 1.5}]"#.into(),
            traits: r#"[{
                "id": "tough", "name_key": "trait.tough.name", "description_key": "trait.tough.description",
                "skill_modifiers": [{"skill": "mining", "op": "Flat", "value": 5}],
                "custom_effects": [{"handler": "test_handler", "params": {"strength": 2}}]
            }]"#.into(),
            origins: r#"[{
                "id": "belter", "name_key": "origin.belter.name", "description_key": "origin.belter.description",
                "skill_bonuses": [{"id": "mining", "amount": 3}]
            }]"#.into(),
            careers: r#"[{
                "id": "miner", "name_key": "career.miner.name", "description_key": "career.miner.description",
                "skill_bonuses": [{"id": "mining", "amount": 2}]
            }]"#.into(),
            tags: r#"[{"id": "fuel", "name_key": "tag.fuel.name"}]"#.into(),
            resources: r#"[{"id": "coal", "name_key": "resource.coal.name", "description_key": "resource.coal.description", "tags": ["fuel"]}]"#.into(),
            formations: r#"[{
                "id": "coal_sandstone", "name_key": "formation.coal_sandstone.name", "description_key": "formation.coal_sandstone.description",
                "matrix_resource": "sandstone",
                "embedded_resources": [{"resource": "coal", "probability": 1.0, "min_grade": 0.02, "max_grade": 0.10}]
            }]"#.into(),
            asteroid_types: r#"[{
                "id": "c_type", "name_key": "asteroid_type.c_type.name", "description_key": "asteroid_type.c_type.description",
                "mass_classes": [{"id": "s", "name_key": "mass_class.s.name", "min_mass": 5000, "max_mass": 50000, "max_sites": 1}],
                "formations": [{"formation": "coal_sandstone", "weight": 5}]
            }]"#.into(),
            ship_modules: r#"[{"id": "bridge_basic", "category": "bridge", "name_key": "ship_module.bridge_basic.name", "description_key": "ship_module.bridge_basic.description"}]"#.into(),
            machines: r#"[{"id": "mining_rig_basic", "category": "mining_rig", "name_key": "machine.mining_rig_basic.name", "description_key": "machine.mining_rig_basic.description", "hopper_capacity": 100, "max_extraction_rate": 100, "crew_slots": 2}]"#.into(),
            names: r#"{"male_first": ["Ivan"], "female_first": ["Olga"], "male_middle": ["Ivanovich"], "female_middle": ["Ivanovna"], "male_last": ["Petrov"], "female_last": ["Petrova"]}"#.into(),
            scenarios: r#"[{"id": "test", "name_key": "scenario.test.name", "description_key": "scenario.test.description", "crew": [{"sex": null, "age": [25, 40], "skills": {"mining": [5, 5]}}]}]"#.into(),
        }
    }

    #[test]
    fn load_data_pack_parses_definitions_from_json() {
        let defs = load_data_pack_inner(&test_files()).unwrap();

        let skill = defs
            .skills
            .get(&SkillId("mining".into()))
            .expect("mining skill");
        assert_eq!(skill.name_key, "skill.mining.name");
        assert_eq!(skill.xp_base, 100);

        let tr = defs
            .traits
            .get(&TraitId("tough".into()))
            .expect("tough trait");
        assert_eq!(tr.name_key, "trait.tough.name");
        assert_eq!(tr.skill_modifiers[0].skill.0, "mining");

        let origin = defs
            .origins
            .get(&OriginId("belter".into()))
            .expect("belter origin");
        assert_eq!(origin.name_key, "origin.belter.name");
        assert_eq!(origin.skill_bonuses[0].amount, 3);

        let career = defs
            .careers
            .get(&CareerId("miner".into()))
            .expect("miner career");
        assert_eq!(career.name_key, "career.miner.name");
        assert_eq!(career.skill_bonuses[0].amount, 2);

        let tag = defs.tags.get(&TagId("fuel".into())).expect("fuel tag");
        assert_eq!(tag.name_key, "tag.fuel.name");

        let resource = defs
            .resources
            .get(&ResourceId("coal".into()))
            .expect("coal resource");
        assert_eq!(resource.name_key, "resource.coal.name");
        assert_eq!(resource.tags[0], TagId("fuel".into()));

        let formation = defs
            .formations
            .get(&FormationId("coal_sandstone".into()))
            .expect("coal_sandstone formation");
        assert_eq!(formation.matrix_resource, ResourceId("sandstone".into()));
        assert_eq!(
            formation.embedded_resources[0].resource,
            ResourceId("coal".into())
        );

        let asteroid_type = defs
            .asteroid_types
            .get(&AsteroidTypeId("c_type".into()))
            .expect("c_type asteroid");
        assert_eq!(asteroid_type.mass_classes[0].max_sites, 1);
        assert_eq!(
            asteroid_type.formations[0].formation,
            FormationId("coal_sandstone".into())
        );
    }

    #[test]
    fn load_data_pack_returns_error_on_invalid_json() {
        let mut files = test_files();
        files.skills = "not valid json [[[".into();

        let result = load_data_pack_inner(&files);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("JSON error"));
    }
}
