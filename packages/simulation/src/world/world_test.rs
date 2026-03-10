#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use crate::pawn::*;
    use crate::world::{Definitions, GameState};

    fn base_defs() -> Definitions {
        let mut defs = Definitions::new();

        defs.skills.register(
            SkillId("mining".into()),
            SkillDef {
                id: SkillId("mining".into()),
                name: "Mining".into(),
                description: "Hit rocks".into(),
                max_level: 20,
                xp_base: 100,
                xp_growth: 1.5,
            },
        );

        defs.dispositions.register(
            DispositionId("loyalty".into()),
            DispositionDef {
                id: DispositionId("loyalty".into()),
                name: "Loyalty".into(),
                description: "Sticks with you".into(),
                low_label: "Mercenary".into(),
                high_label: "Ride or die".into(),
            },
        );

        defs.traits.register(
            TraitId("strongman".into()),
            TraitDef {
                id: TraitId("strongman".into()),
                name: "Strongman".into(),
                description: "Built like a cargo loader".into(),
                skill_modifiers: vec![SkillModifier {
                    skill: SkillId("mining".into()),
                    op: ModifierOp::Flat,
                    value: 2.0,
                }],
                disposition_modifiers: vec![],
                custom_effects: vec![],
            },
        );

        defs.origins.register(
            OriginId("belt_colony".into()),
            OriginDef {
                id: OriginId("belt_colony".into()),
                name: "Belt Colony Brat".into(),
                description: "Raised on a mining outpost".into(),
                skill_bonuses: vec![StartingBonus {
                    id: SkillId("mining".into()),
                    amount: 2,
                }],
                disposition_bonuses: vec![],
            },
        );

        defs.careers.register(
            CareerId("belt_miner".into()),
            CareerDef {
                id: CareerId("belt_miner".into()),
                name: "Belt Miner".into(),
                description: "Spent years extracting ore".into(),
                skill_bonuses: vec![StartingBonus {
                    id: SkillId("mining".into()),
                    amount: 4,
                }],
                disposition_bonuses: vec![],
            },
        );

        defs
    }

    fn create_kowalski(state: &mut GameState) -> PawnId {
        let mut skills = HashMap::new();
        skills.insert(SkillId("mining".into()), SkillState::with_level(8));

        let mut dispositions = HashMap::new();
        dispositions.insert(DispositionId("loyalty".into()), DispositionState::new(4));

        state.pawns.insert(Pawn {
            id: PawnId::default(),
            first_name: "Jan".into(),
            last_name: "Kowalski".into(),
            nickname: None,
            age: 34,
            sex: Sex::Male,
            origin: OriginId("belt_colony".into()),
            career: CareerId("belt_miner".into()),
            traits: vec![TraitId("strongman".into())],
            skills,
            dispositions,
        })
    }

    #[test]
    fn create_game_state_with_pawn() {
        let mut state = GameState::new(base_defs());
        let id = create_kowalski(&mut state);

        let pawn = &state.pawns[id];
        assert_eq!(pawn.first_name, "Jan");
        assert_eq!(pawn.last_name, "Kowalski");
        assert_eq!(pawn.skills[&SkillId("mining".into())].level, 8);
        assert_eq!(pawn.dispositions[&DispositionId("loyalty".into())].value, 4);
        assert_eq!(pawn.traits.len(), 1);
    }

    #[test]
    fn pawn_references_valid_definitions() {
        let mut state = GameState::new(base_defs());
        let id = create_kowalski(&mut state);
        let pawn = &state.pawns[id];

        assert!(state.defs.origins.contains(&pawn.origin));
        assert!(state.defs.careers.contains(&pawn.career));

        for trait_id in &pawn.traits {
            assert!(state.defs.traits.contains(trait_id));
        }

        for skill_id in pawn.skills.keys() {
            assert!(state.defs.skills.contains(skill_id));
        }
    }

    #[test]
    fn serialize_and_deserialize_round_trip() {
        let mut state = GameState::new(base_defs());
        create_kowalski(&mut state);

        let json = serde_json::to_string(&state).expect("serialize failed");
        let restored: GameState = serde_json::from_str(&json).expect("deserialize failed");

        assert_eq!(restored.pawns.len(), 1);
        assert_eq!(restored.defs.skills.len(), 1);
        assert_eq!(restored.turn, 0);

        let (_, pawn) = restored.pawns.iter().next().unwrap();
        assert_eq!(pawn.first_name, "Jan");
        assert_eq!(pawn.skills[&SkillId("mining".into())].level, 8);
    }
}
