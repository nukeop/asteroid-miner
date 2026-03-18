#[cfg(test)]
mod tests {
    use asteroid_miner_types::{AsteroidTypeId, FormationId};

    use crate::{AsteroidTypeDef, MassClass, WeightedFormation};

    fn make_asteroid_type(
        mass_classes: Vec<MassClass>,
        formations: Vec<WeightedFormation>,
    ) -> AsteroidTypeDef {
        AsteroidTypeDef {
            id: AsteroidTypeId("test_type".into()),
            name_key: "asteroid_type.test.name".into(),
            description_key: "asteroid_type.test.description".into(),
            mass_classes,
            formations,
        }
    }

    fn small_class() -> MassClass {
        MassClass {
            id: "S".into(),
            name_key: "mass_class.s.name".into(),
            min_mass: 5000.0,
            max_mass: 50000.0,
            max_sites: 1,
        }
    }

    fn coal_formation() -> WeightedFormation {
        WeightedFormation {
            formation: FormationId("coal_bearing_sandstone".into()),
            weight: 5.0,
        }
    }

    #[test]
    fn valid_asteroid_type_passes_validation() {
        let at = make_asteroid_type(vec![small_class()], vec![coal_formation()]);
        assert!(at.validate().is_ok());
    }

    #[test]
    fn empty_mass_classes_fails() {
        let at = make_asteroid_type(vec![], vec![coal_formation()]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': mass_classes must not be empty"
        );
    }

    #[test]
    fn empty_formations_fails() {
        let at = make_asteroid_type(vec![small_class()], vec![]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': formations must not be empty"
        );
    }

    #[test]
    fn min_mass_greater_than_max_mass_fails() {
        let mut class = small_class();
        class.min_mass = 100000.0;
        class.max_mass = 5000.0;
        let at = make_asteroid_type(vec![class], vec![coal_formation()]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': mass class 'S' has min_mass 100000 > max_mass 5000"
        );
    }

    #[test]
    fn zero_max_sites_fails() {
        let mut class = small_class();
        class.max_sites = 0;
        let at = make_asteroid_type(vec![class], vec![coal_formation()]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': mass class 'S' has max_sites 0 (must be >= 1)"
        );
    }

    #[test]
    fn zero_weight_fails() {
        let formation = WeightedFormation {
            formation: FormationId("bad".into()),
            weight: 0.0,
        };
        let at = make_asteroid_type(vec![small_class()], vec![formation]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': formation 'bad' has weight 0 (must be positive)"
        );
    }

    #[test]
    fn negative_weight_fails() {
        let formation = WeightedFormation {
            formation: FormationId("bad".into()),
            weight: -1.0,
        };
        let at = make_asteroid_type(vec![small_class()], vec![formation]);
        assert_eq!(
            at.validate().unwrap_err(),
            "Asteroid type 'test_type': formation 'bad' has weight -1 (must be positive)"
        );
    }
}
