#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use asteroid_miner_types::*;

    use crate::{CareerDef, CrewTemplate, Definitions, OriginDef, ScenarioDef, SkillDef};

    fn test_defs() -> Definitions {
        let mut defs = Definitions::new();
        defs.skills.register(
            SkillId("mining".into()),
            SkillDef {
                id: SkillId("mining".into()),
                name_key: "skill.mining.name".into(),
                description_key: "skill.mining.description".into(),
                xp_base: 100,
                xp_growth: 1.5,
            },
        );
        defs.origins.register(
            OriginId("civilian".into()),
            OriginDef {
                id: OriginId("civilian".into()),
                name_key: "origin.civilian.name".into(),
                description_key: "origin.civilian.description".into(),
                skill_bonuses: vec![],
            },
        );
        defs.careers.register(
            CareerId("civilian".into()),
            CareerDef {
                id: CareerId("civilian".into()),
                name_key: "career.civilian.name".into(),
                description_key: "career.civilian.description".into(),
                skill_bonuses: vec![],
            },
        );
        defs
    }

    fn valid_template() -> CrewTemplate {
        CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::from([(SkillId("mining".into()), [5, 5])]),
        }
    }

    fn scenario_with(crew: Vec<CrewTemplate>) -> ScenarioDef {
        ScenarioDef {
            id: ScenarioId("test".into()),
            name_key: "scenario.test.name".into(),
            description_key: "scenario.test.description".into(),
            crew,
        }
    }

    #[test]
    fn valid_scenario_passes() {
        let defs = test_defs();
        let scenario = scenario_with(vec![valid_template()]);
        assert!(scenario.validate(&defs).is_ok());
    }

    #[test]
    fn empty_crew_list_fails() {
        let defs = test_defs();
        let scenario = scenario_with(vec![]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test': crew list is empty"
        );
    }

    #[test]
    fn unknown_origin_fails() {
        let defs = test_defs();
        let mut template = valid_template();
        template.origins_whitelist = vec![OriginId("martian".into())];
        let scenario = scenario_with(vec![template]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test' crew[0]: unknown origin 'martian'"
        );
    }

    #[test]
    fn unknown_career_fails() {
        let defs = test_defs();
        let mut template = valid_template();
        template.careers_whitelist = vec![CareerId("cosmonaut".into())];
        let scenario = scenario_with(vec![template]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test' crew[0]: unknown career 'cosmonaut'"
        );
    }

    #[test]
    fn unknown_skill_fails() {
        let defs = test_defs();
        let mut template = valid_template();
        template.skills = HashMap::from([(SkillId("alchemy".into()), [1, 5])]);
        let scenario = scenario_with(vec![template]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test' crew[0]: unknown skill 'alchemy'"
        );
    }

    #[test]
    fn skill_range_min_greater_than_max_fails() {
        let defs = test_defs();
        let mut template = valid_template();
        template.skills = HashMap::from([(SkillId("mining".into()), [8, 3])]);
        let scenario = scenario_with(vec![template]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test' crew[0]: skill 'mining' min (8) > max (3)"
        );
    }

    #[test]
    fn age_range_min_greater_than_max_fails() {
        let defs = test_defs();
        let mut template = valid_template();
        template.age = [45, 20];
        let scenario = scenario_with(vec![template]);
        assert_eq!(
            scenario.validate(&defs).unwrap_err(),
            "scenario 'test' crew[0]: age min (45) > max (20)"
        );
    }

    #[test]
    fn empty_whitelists_passes() {
        let defs = test_defs();
        let template = CrewTemplate {
            origins_whitelist: vec![],
            careers_whitelist: vec![],
            sex: Some(Sex::Male),
            age: [20, 30],
            skills: HashMap::from([(SkillId("mining".into()), [1, 10])]),
        };
        let scenario = scenario_with(vec![template]);
        assert!(scenario.validate(&defs).is_ok());
    }
}
