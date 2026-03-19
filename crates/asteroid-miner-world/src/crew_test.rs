#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use asteroid_miner_defs::*;
    use asteroid_miner_types::*;
    use rand::rngs::StdRng;
    use rand::SeedableRng;

    use crate::{instantiate_pawn, GameState};

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

    fn test_name_pool() -> NamePool {
        NamePool {
            male_first: vec!["Ivan".into()],
            female_first: vec!["Olga".into()],
            male_middle: vec!["Ivanovich".into()],
            female_middle: vec!["Ivanovna".into()],
            male_last: vec!["Petrov".into()],
            female_last: vec!["Petrova".into()],
        }
    }

    fn seeded_rng() -> StdRng {
        StdRng::seed_from_u64(42)
    }

    #[test]
    fn exact_skill_range_produces_that_level() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::from([(SkillId("mining".into()), [5, 5])]),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert_eq!(pawn.skills[&SkillId("mining".into())].level, 5);
    }

    #[test]
    fn locked_female_sex_produces_female_with_female_names() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: Some(Sex::Female),
            age: [25, 40],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert_eq!(pawn.sex, Sex::Female);
        assert_eq!(pawn.first_name, "Olga");
        assert_eq!(pawn.middle_name, "Ivanovna");
        assert_eq!(pawn.last_name, "Petrova");
    }

    #[test]
    fn null_sex_gets_random_sex() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert!(pawn.sex == Sex::Male || pawn.sex == Sex::Female);
    }

    #[test]
    fn exact_age_range_produces_that_age() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [30, 30],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert_eq!(pawn.age, 30);
    }

    #[test]
    fn whitelist_origin_is_picked() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert_eq!(pawn.origin, OriginId("civilian".into()));
    }

    #[test]
    fn empty_whitelist_picks_from_definitions() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![],
            careers_whitelist: vec![],
            sex: None,
            age: [25, 40],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert_eq!(pawn.origin, OriginId("civilian".into()));
        assert_eq!(pawn.career, CareerId("civilian".into()));
    }

    #[test]
    fn skill_range_produces_value_within_bounds() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::from([(SkillId("mining".into()), [1, 10])]),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        let level = pawn.skills[&SkillId("mining".into())].level;
        assert!(level >= 1 && level <= 10, "level {} not in [1, 10]", level);
    }

    #[test]
    fn pawn_has_empty_traits_and_no_nickname() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: None,
            age: [25, 40],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        assert!(pawn.traits.is_empty());
        assert_eq!(pawn.nickname, None);
    }

    #[test]
    fn add_pawn_assigns_valid_id() {
        let defs = test_defs();
        let pool = test_name_pool();
        let template = CrewTemplate {
            origins_whitelist: vec![OriginId("civilian".into())],
            careers_whitelist: vec![CareerId("civilian".into())],
            sex: Some(Sex::Male),
            age: [30, 30],
            skills: HashMap::new(),
        };
        let pawn = instantiate_pawn(&template, &pool, &defs, &mut seeded_rng());
        let mut state = GameState::new(defs);
        let id = state.add_pawn(pawn);
        let stored = &state.pawns[id];
        assert_eq!(stored.id, id);
        assert_eq!(stored.first_name, "Ivan");
    }
}
