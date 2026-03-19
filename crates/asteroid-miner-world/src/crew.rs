use asteroid_miner_defs::{CrewTemplate, Definitions, NamePool};
use asteroid_miner_types::*;
use rand::seq::IndexedRandom;
use rand::{Rng, RngExt};

use crate::{Pawn, SkillState};

fn pick_from_whitelist_or_all<T: Clone>(
    whitelist: &[T],
    all_keys: Vec<&T>,
    rng: &mut impl Rng,
) -> T {
    if whitelist.is_empty() {
        (*all_keys.choose(rng).unwrap()).clone()
    } else {
        whitelist.choose(rng).unwrap().clone()
    }
}

pub fn instantiate_pawn(
    template: &CrewTemplate,
    name_pool: &NamePool,
    defs: &Definitions,
    rng: &mut impl Rng,
) -> Pawn {
    let sex = template.sex.unwrap_or(if rng.random_bool(0.5) {
        Sex::Male
    } else {
        Sex::Female
    });

    let (firsts, middles, lasts) = match sex {
        Sex::Male => (
            &name_pool.male_first,
            &name_pool.male_middle,
            &name_pool.male_last,
        ),
        Sex::Female => (
            &name_pool.female_first,
            &name_pool.female_middle,
            &name_pool.female_last,
        ),
    };

    let origin_keys: Vec<_> = defs.origins.iter().map(|(k, _)| k).collect();
    let career_keys: Vec<_> = defs.careers.iter().map(|(k, _)| k).collect();

    let skills = template
        .skills
        .iter()
        .map(|(id, [min, max])| {
            (
                id.clone(),
                SkillState::with_level(rng.random_range(*min..=*max)),
            )
        })
        .collect();

    Pawn {
        id: PawnId::default(),
        first_name: firsts.choose(rng).unwrap().clone(),
        middle_name: middles.choose(rng).unwrap().clone(),
        last_name: lasts.choose(rng).unwrap().clone(),
        nickname: None,
        age: rng.random_range(template.age[0]..=template.age[1]),
        sex,
        origin: pick_from_whitelist_or_all(&template.origins_whitelist, origin_keys, rng),
        career: pick_from_whitelist_or_all(&template.careers_whitelist, career_keys, rng),
        traits: vec![],
        skills,
    }
}
