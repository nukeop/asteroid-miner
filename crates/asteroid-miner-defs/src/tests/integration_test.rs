#[cfg(test)]
mod tests {
    use asteroid_miner_types::*;

    use crate::data_pack::*;
    use crate::*;

    #[test]
    fn load_base_data_pack_from_real_files() {
        let skills = load_skills(include_str!(
            "../../../../packages/game/data/base/skills.json"
        ))
        .unwrap();
        let traits = load_traits(include_str!(
            "../../../../packages/game/data/base/traits.json"
        ))
        .unwrap();
        let origins = load_origins(include_str!(
            "../../../../packages/game/data/base/origins.json"
        ))
        .unwrap();
        let careers = load_careers(include_str!(
            "../../../../packages/game/data/base/careers.json"
        ))
        .unwrap();
        let tags = load_tags(include_str!(
            "../../../../packages/game/data/base/tags.json"
        ))
        .unwrap();
        let resources = load_resources(include_str!(
            "../../../../packages/game/data/base/resources.json"
        ))
        .unwrap();
        let formations = load_formations(include_str!(
            "../../../../packages/game/data/base/formations.json"
        ))
        .unwrap();
        let asteroid_types = load_asteroid_types(include_str!(
            "../../../../packages/game/data/base/asteroid_types.json"
        ))
        .unwrap();
        let ship_modules = load_ship_modules(include_str!(
            "../../../../packages/game/data/base/ship_modules.json"
        ))
        .unwrap();
        let machines = load_machines(include_str!(
            "../../../../packages/game/data/base/machines.json"
        ))
        .unwrap();
        let name_pool = load_name_pool(include_str!(
            "../../../../packages/game/data/base/names.json"
        ))
        .unwrap();

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

        let scenarios = load_scenarios(
            include_str!("../../../../packages/game/data/base/scenarios.json"),
            &defs,
        )
        .unwrap();
        register_scenarios(&mut defs, scenarios);

        assert_eq!(defs.ship_modules.len(), 8);
        assert_eq!(defs.machines.len(), 2);

        assert!(matches!(
            defs.ship_modules
                .get(&ShipModuleId("bridge_basic".into()))
                .unwrap(),
            ShipModuleDef::Bridge { .. }
        ));

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
                assert_eq!(*speed, 1.0);
                assert_eq!(*fuel_efficiency, 1.0);
            }
            other => panic!("Expected Engine, got {:?}", other),
        }

        match defs
            .ship_modules
            .get(&ShipModuleId("cargo_bay_small".into()))
            .unwrap()
        {
            ShipModuleDef::CargoBay { capacity, .. } => {
                assert_eq!(*capacity, 1000.0);
            }
            other => panic!("Expected CargoBay, got {:?}", other),
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

        match defs
            .machines
            .get(&MachineId("scanning_rig_basic".into()))
            .unwrap()
        {
            MachineDef::ScanningRig {
                accuracy,
                crew_slots,
                ..
            } => {
                assert_eq!(*accuracy, 0.5);
                assert_eq!(*crew_slots, 1);
            }
            other => panic!("Expected ScanningRig, got {:?}", other),
        }

        assert_eq!(defs.scenarios.len(), 1);
        let scenario = defs.scenarios.get(&ScenarioId("starting".into())).unwrap();
        assert_eq!(scenario.crew.len(), 3);

        assert_eq!(defs.name_pool.male_first.len(), 1);

        assert!(defs.origins.contains(&OriginId("civilian".into())));
        assert!(defs.careers.contains(&CareerId("civilian".into())));
    }
}
