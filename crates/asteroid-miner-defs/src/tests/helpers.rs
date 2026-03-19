#![allow(dead_code)]

use asteroid_miner_types::*;

use crate::{CareerDef, Definitions, NamePool, OriginDef, SkillDef};

pub fn minimal_defs() -> Definitions {
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

pub fn single_name_pool() -> NamePool {
    NamePool {
        male_first: vec!["Ivan".into()],
        female_first: vec!["Natasha".into()],
        male_middle: vec!["Ivanovich".into()],
        female_middle: vec!["Ivanovna".into()],
        male_last: vec!["Petrov".into()],
        female_last: vec!["Petrova".into()],
    }
}
