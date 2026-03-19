#[cfg(test)]
mod tests {
    use asteroid_miner_types::{FormationId, ResourceId};

    use crate::{EmbeddedResource, FormationDef};

    fn sandstone() -> ResourceId {
        ResourceId("sandstone".into())
    }

    fn coal() -> ResourceId {
        ResourceId("coal".into())
    }

    fn iron() -> ResourceId {
        ResourceId("iron_ore".into())
    }

    fn make_formation(embedded: Vec<EmbeddedResource>) -> FormationDef {
        FormationDef {
            id: FormationId("test_formation".into()),
            name_key: "formation.test.name".into(),
            description_key: "formation.test.description".into(),
            matrix_resource: sandstone(),
            embedded_resources: embedded,
        }
    }

    #[test]
    fn valid_formation_passes_validation() {
        let formation = make_formation(vec![
            EmbeddedResource {
                resource: coal(),
                probability: 1.0,
                min_grade: 0.02,
                max_grade: 0.10,
            },
            EmbeddedResource {
                resource: iron(),
                probability: 0.3,
                min_grade: 0.005,
                max_grade: 0.02,
            },
        ]);
        assert!(formation.validate().is_ok());
    }

    #[test]
    fn no_embedded_resources_is_valid() {
        let formation = make_formation(vec![]);
        assert!(formation.validate().is_ok());
    }

    #[test]
    fn max_grades_summing_over_one_fails() {
        let formation = make_formation(vec![
            EmbeddedResource {
                resource: coal(),
                probability: 1.0,
                min_grade: 0.0,
                max_grade: 0.6,
            },
            EmbeddedResource {
                resource: iron(),
                probability: 1.0,
                min_grade: 0.0,
                max_grade: 0.5,
            },
        ]);
        assert_eq!(
            formation.validate().unwrap_err(),
            "Formation 'test_formation': sum of max_grades is 1.1 (must be <= 1.0)"
        );
    }

    #[test]
    fn min_grade_greater_than_max_grade_fails() {
        let formation = make_formation(vec![EmbeddedResource {
            resource: coal(),
            probability: 1.0,
            min_grade: 0.15,
            max_grade: 0.05,
        }]);
        assert_eq!(
            formation.validate().unwrap_err(),
            "Formation 'test_formation': embedded resource 'coal' has min_grade 0.15 > max_grade 0.05"
        );
    }

    #[test]
    fn probability_above_one_fails() {
        let formation = make_formation(vec![EmbeddedResource {
            resource: coal(),
            probability: 1.5,
            min_grade: 0.02,
            max_grade: 0.10,
        }]);
        assert_eq!(
            formation.validate().unwrap_err(),
            "Formation 'test_formation': embedded resource 'coal' has probability 1.5 outside [0.0, 1.0]"
        );
    }

    #[test]
    fn negative_probability_fails() {
        let formation = make_formation(vec![EmbeddedResource {
            resource: coal(),
            probability: -0.1,
            min_grade: 0.02,
            max_grade: 0.10,
        }]);
        assert_eq!(
            formation.validate().unwrap_err(),
            "Formation 'test_formation': embedded resource 'coal' has probability -0.1 outside [0.0, 1.0]"
        );
    }
}
