#[cfg(test)]
mod tests {
    use asteroid_miner_types::SkillId;

    use crate::SkillDef;

    fn make_skill_def() -> SkillDef {
        SkillDef {
            id: SkillId("mining".into()),
            name: "Mining".into(),
            description: "Hit rocks, get ore".into(),
            xp_base: 100,
            xp_growth: 1.5,
        }
    }

    #[test]
    fn xp_for_level_zero_is_free() {
        let def = make_skill_def();
        assert_eq!(def.xp_for_level(0), 0);
    }

    #[test]
    fn xp_for_level_one_equals_base() {
        let def = make_skill_def();
        assert_eq!(def.xp_for_level(1), 100);
    }

    #[test]
    fn xp_grows_exponentially() {
        let def = make_skill_def();
        assert_eq!(def.xp_for_level(2), 150);
        assert_eq!(def.xp_for_level(3), 225);
        assert_eq!(def.xp_for_level(4), 337);
    }

    #[test]
    fn modded_skill_with_lower_base_is_cheaper() {
        let base = make_skill_def();
        let modded = SkillDef {
            xp_base: 50,
            ..make_skill_def()
        };
        assert_eq!(modded.xp_for_level(1), 50);
        assert!(modded.xp_for_level(5) < base.xp_for_level(5));
    }
}
