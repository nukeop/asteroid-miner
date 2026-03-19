#[cfg(test)]
mod tests {
    use asteroid_miner_types::*;

    use crate::data_pack::*;
    use crate::*;

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
            vec![ShipModuleDef::Engine {
                id: ShipModuleId("engine_basic".into()),
                name_key: "ship_module.engine_basic.name".into(),
                description_key: "ship_module.engine_basic.description".into(),
                speed: 1.5,
                fuel_efficiency: 0.8,
            }],
            vec![MachineDef::MiningRig {
                id: MachineId("mining_rig_basic".into()),
                name_key: "machine.mining_rig_basic.name".into(),
                description_key: "machine.mining_rig_basic.description".into(),
                hopper_capacity: 100.0,
                max_extraction_rate: 100.0,
                crew_slots: 2,
            }],
            NamePool::default(),
        );

        assert_eq!(defs.skills.len(), 1);
        assert_eq!(defs.traits.len(), 1);
        assert_eq!(defs.origins.len(), 1);
        assert_eq!(defs.careers.len(), 1);
        assert_eq!(defs.tags.len(), 1);
        assert_eq!(defs.resources.len(), 1);
        assert_eq!(defs.formations.len(), 1);
        assert_eq!(defs.asteroid_types.len(), 1);
        assert_eq!(defs.ship_modules.len(), 1);
        assert_eq!(defs.machines.len(), 1);

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
        match defs
            .ship_modules
            .get(&ShipModuleId("engine_basic".into()))
            .unwrap()
        {
            ShipModuleDef::Engine {
                speed,
                fuel_efficiency,
                ..
            } => {
                assert_eq!(*speed, 1.5);
                assert_eq!(*fuel_efficiency, 0.8);
            }
            other => panic!("Expected Engine, got {:?}", other),
        }
        match defs
            .machines
            .get(&MachineId("mining_rig_basic".into()))
            .unwrap()
        {
            MachineDef::MiningRig {
                hopper_capacity,
                max_extraction_rate,
                crew_slots,
                ..
            } => {
                assert_eq!(*hopper_capacity, 100.0);
                assert_eq!(*max_extraction_rate, 100.0);
                assert_eq!(*crew_slots, 2);
            }
            other => panic!("Expected MiningRig, got {:?}", other),
        }
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
            vec![],
            vec![],
            NamePool::default(),
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
            vec![],
            vec![],
            NamePool::default(),
        );

        assert_eq!(defs.skills.len(), 1);
        let skill = defs.skills.get(&SkillId("mining".into())).unwrap();
        assert_eq!(skill.name_key, "skill.mining.name.v2");
        assert_eq!(skill.xp_base, 200);
    }
}
