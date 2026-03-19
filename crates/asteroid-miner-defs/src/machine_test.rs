#[cfg(test)]
mod tests {
    use asteroid_miner_types::MachineId;

    use crate::MachineDef;

    fn mining_rig(hopper_capacity: f32, max_extraction_rate: f32, crew_slots: u32) -> MachineDef {
        MachineDef::MiningRig {
            id: MachineId("test_mining_rig".into()),
            name_key: "machine.test.name".into(),
            description_key: "machine.test.description".into(),
            hopper_capacity,
            max_extraction_rate,
            crew_slots,
        }
    }

    fn scanning_rig(accuracy: f32, crew_slots: u32) -> MachineDef {
        MachineDef::ScanningRig {
            id: MachineId("test_scanning_rig".into()),
            name_key: "machine.test.name".into(),
            description_key: "machine.test.description".into(),
            accuracy,
            crew_slots,
        }
    }

    #[test]
    fn valid_mining_rig_passes() {
        assert!(mining_rig(100.0, 50.0, 2).validate().is_ok());
    }

    #[test]
    fn mining_rig_zero_hopper_capacity_fails() {
        assert_eq!(
            mining_rig(0.0, 50.0, 2).validate().unwrap_err(),
            "Machine 'test_mining_rig': hopper_capacity must be > 0, got 0"
        );
    }

    #[test]
    fn mining_rig_negative_extraction_rate_fails() {
        assert_eq!(
            mining_rig(100.0, -1.0, 2).validate().unwrap_err(),
            "Machine 'test_mining_rig': max_extraction_rate must be > 0, got -1"
        );
    }

    #[test]
    fn mining_rig_zero_crew_slots_fails() {
        assert_eq!(
            mining_rig(100.0, 50.0, 0).validate().unwrap_err(),
            "Machine 'test_mining_rig': crew_slots must be >= 1, got 0"
        );
    }

    #[test]
    fn valid_scanning_rig_passes() {
        assert!(scanning_rig(0.5, 1).validate().is_ok());
    }

    #[test]
    fn scanning_rig_accuracy_at_one_passes() {
        assert!(scanning_rig(1.0, 1).validate().is_ok());
    }

    #[test]
    fn scanning_rig_zero_accuracy_fails() {
        assert_eq!(
            scanning_rig(0.0, 1).validate().unwrap_err(),
            "Machine 'test_scanning_rig': accuracy must be in (0.0, 1.0], got 0"
        );
    }

    #[test]
    fn scanning_rig_accuracy_above_one_fails() {
        assert_eq!(
            scanning_rig(1.5, 1).validate().unwrap_err(),
            "Machine 'test_scanning_rig': accuracy must be in (0.0, 1.0], got 1.5"
        );
    }
}
