#[cfg(test)]
mod tests {
    use crate::data_pack::*;

    #[test]
    fn parse_dependency_required() {
        let dep = parse_dependency("base >= 1.0.0").unwrap();
        assert_eq!(dep.kind, DependencyKind::Required);
        assert_eq!(dep.pack_id, "base");
        let req = dep.version_req.unwrap();
        assert!(req.matches(&semver::Version::new(1, 0, 0)));
        assert!(req.matches(&semver::Version::new(2, 0, 0)));
        assert!(!req.matches(&semver::Version::new(0, 9, 0)));
    }

    #[test]
    fn parse_dependency_optional() {
        let dep = parse_dependency("? some_mod").unwrap();
        assert_eq!(dep.kind, DependencyKind::Optional);
        assert_eq!(dep.pack_id, "some_mod");
        assert!(dep.version_req.is_none());
    }

    #[test]
    fn parse_dependency_incompatible() {
        let dep = parse_dependency("! bad_mod >= 2.0.0").unwrap();
        assert_eq!(dep.kind, DependencyKind::Incompatible);
        assert_eq!(dep.pack_id, "bad_mod");
        let req = dep.version_req.unwrap();
        assert!(req.matches(&semver::Version::new(2, 0, 0)));
        assert!(!req.matches(&semver::Version::new(1, 9, 9)));
    }

    #[test]
    fn parse_dependency_id_only() {
        let dep = parse_dependency("base").unwrap();
        assert_eq!(dep.kind, DependencyKind::Required);
        assert_eq!(dep.pack_id, "base");
        assert!(dep.version_req.is_none());
    }

    #[test]
    fn parse_dependency_rejects_invalid() {
        assert!(parse_dependency("Bad String!!").is_err());
    }

    #[test]
    fn parse_dependency_all_operators() {
        let cases = [
            ("mod_a = 1.0.0", "="),
            ("mod_a > 1.0.0", ">"),
            ("mod_a >= 1.0.0", ">="),
            ("mod_a < 2.0.0", "<"),
            ("mod_a <= 2.0.0", "<="),
        ];
        for (input, expected_op) in cases {
            let dep =
                parse_dependency(input).unwrap_or_else(|e| panic!("failed on '{input}': {e}"));
            let req_str = dep.version_req.unwrap().to_string();
            assert!(
                req_str.contains(expected_op),
                "'{input}': expected '{expected_op}' in '{req_str}'"
            );
        }
    }

    #[test]
    fn parse_dependency_rejects_empty_string() {
        assert!(parse_dependency("").is_err());
    }

    #[test]
    fn parse_dependency_rejects_uppercase_id() {
        assert!(parse_dependency("Base >= 1.0.0").is_err());
    }

    #[test]
    fn parse_dependency_rejects_invalid_operator() {
        assert!(parse_dependency("mod_a >> 1.0.0").is_err());
    }

    #[test]
    fn parse_dependency_rejects_invalid_version() {
        assert!(parse_dependency("mod_a >= not.a.ver").is_err());
    }
}
