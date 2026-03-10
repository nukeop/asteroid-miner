#[cfg(test)]
mod tests {
    use crate::pawn::{SkillDef, SkillId};
    use crate::registry::Registry;

    fn mining_def() -> SkillDef {
        SkillDef {
            id: SkillId("mining".into()),
            name: "Mining".into(),
            description: "Hit rocks".into(),
            max_level: 20,
            xp_base: 100,
            xp_growth: 1.5,
        }
    }

    #[test]
    fn register_and_lookup() {
        let mut reg: Registry<SkillId, SkillDef> = Registry::new();
        let id = SkillId("mining".into());
        reg.register(id.clone(), mining_def());

        assert!(reg.contains(&id));
        assert_eq!(reg.get(&id).unwrap().name, "Mining");
        assert_eq!(reg.get(&id).unwrap().description, "Hit rocks");
        assert_eq!(reg.get(&id).unwrap().max_level, 20);
        assert_eq!(reg.get(&id).unwrap().xp_base, 100);
        assert_eq!(reg.get(&id).unwrap().xp_growth, 1.5);
        assert_eq!(reg.len(), 1);
    }

    #[test]
    fn lookup_missing_key_returns_none() {
        let reg: Registry<SkillId, SkillDef> = Registry::new();
        assert!(reg.get(&SkillId("nope".into())).is_none());
    }

    #[test]
    fn mod_overwrites_base_definition() {
        let mut reg: Registry<SkillId, SkillDef> = Registry::new();
        let id = SkillId("mining".into());

        reg.register(id.clone(), mining_def());
        assert_eq!(reg.get(&id).unwrap().xp_base, 100);

        let modded = SkillDef {
            xp_base: 50,
            ..mining_def()
        };
        reg.register(id.clone(), modded);
        assert_eq!(reg.get(&id).unwrap().xp_base, 50);
        assert_eq!(reg.len(), 1);
    }
}
