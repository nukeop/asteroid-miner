use regex::Regex;
use serde::{Deserialize, Serialize};
use std::sync::LazyLock;

use crate::*;

static PACK_ID_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^[a-z][a-z0-9_.]*$").unwrap());

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manifest {
    #[serde(rename = "$schema", default, skip_serializing)]
    pub schema: Option<String>,
    pub id: String,
    pub name_key: String,
    pub version: String,
    #[serde(rename = "type")]
    pub pack_type: PackType,
    pub description_key: String,
    pub author: String,
    pub game_version: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub dependencies: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PackType {
    #[serde(rename = "base")]
    Base,
    #[serde(rename = "dlc")]
    Dlc,
    #[serde(rename = "mod")]
    Mod,
}

#[derive(Debug, Clone)]
pub struct Dependency {
    pub kind: DependencyKind,
    pub pack_id: String,
    pub version_req: Option<semver::VersionReq>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DependencyKind {
    Required,
    Optional,
    Incompatible,
}

#[derive(Debug)]
pub enum DataPackError {
    Json(serde_json::Error),
    InvalidManifest(String),
}

impl std::fmt::Display for DataPackError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DataPackError::Json(e) => write!(f, "JSON error: {e}"),
            DataPackError::InvalidManifest(msg) => write!(f, "Invalid manifest: {msg}"),
        }
    }
}

impl std::error::Error for DataPackError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            DataPackError::Json(e) => Some(e),
            DataPackError::InvalidManifest(_) => None,
        }
    }
}

impl From<serde_json::Error> for DataPackError {
    fn from(e: serde_json::Error) -> Self {
        DataPackError::Json(e)
    }
}

fn is_valid_pack_id(id: &str) -> bool {
    PACK_ID_RE.is_match(id)
}

pub fn parse_manifest(json: &str) -> Result<Manifest, DataPackError> {
    let manifest: Manifest = serde_json::from_str(json)?;

    if !is_valid_pack_id(&manifest.id) {
        return Err(DataPackError::InvalidManifest(format!(
            "id '{}' must match [a-z][a-z0-9_.]*",
            manifest.id
        )));
    }

    semver::Version::parse(&manifest.version).map_err(|e| {
        DataPackError::InvalidManifest(format!(
            "version '{}' is not valid semver: {e}",
            manifest.version
        ))
    })?;

    semver::Version::parse(&manifest.game_version).map_err(|e| {
        DataPackError::InvalidManifest(format!(
            "game_version '{}' is not valid semver: {e}",
            manifest.game_version
        ))
    })?;

    for dep in &manifest.dependencies {
        parse_dependency(dep)?;
    }

    Ok(manifest)
}

pub fn parse_dependency(s: &str) -> Result<Dependency, DataPackError> {
    let err = || {
        DataPackError::InvalidManifest(format!(
            "Invalid dependency '{s}': expected format '[?!] pack_id [>= version]'"
        ))
    };

    let tokens: Vec<&str> = s.split_whitespace().collect();
    if tokens.is_empty() {
        return Err(err());
    }

    let (kind, rest) = match tokens[0] {
        "?" => (DependencyKind::Optional, &tokens[1..]),
        "!" => (DependencyKind::Incompatible, &tokens[1..]),
        _ => (DependencyKind::Required, &tokens[..]),
    };

    if rest.is_empty() {
        return Err(err());
    }

    let pack_id = rest[0].to_string();
    if !is_valid_pack_id(&pack_id) {
        return Err(err());
    }

    let version_req = if rest.len() == 1 {
        None
    } else if rest.len() == 3 {
        let op = rest[1];
        match op {
            "=" | ">" | ">=" | "<" | "<=" => {}
            _ => return Err(err()),
        }
        let req_str = format!("{op}{}", rest[2]);
        let req = semver::VersionReq::parse(&req_str).map_err(|_| err())?;
        Some(req)
    } else {
        return Err(err());
    };

    Ok(Dependency {
        kind,
        pack_id,
        version_req,
    })
}

pub fn load_skills(json: &str) -> Result<Vec<SkillDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_traits(json: &str) -> Result<Vec<TraitDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_origins(json: &str) -> Result<Vec<OriginDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_careers(json: &str) -> Result<Vec<CareerDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_tags(json: &str) -> Result<Vec<TagDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_resources(json: &str) -> Result<Vec<ResourceDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_formations(json: &str) -> Result<Vec<FormationDef>, DataPackError> {
    let formations: Vec<FormationDef> = serde_json::from_str(json)?;
    for f in &formations {
        f.validate().map_err(DataPackError::InvalidManifest)?;
    }
    Ok(formations)
}

pub fn load_asteroid_types(json: &str) -> Result<Vec<AsteroidTypeDef>, DataPackError> {
    let types: Vec<AsteroidTypeDef> = serde_json::from_str(json)?;
    for t in &types {
        t.validate().map_err(DataPackError::InvalidManifest)?;
    }
    Ok(types)
}

pub fn load_ship_modules(json: &str) -> Result<Vec<ShipModuleDef>, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_machines(json: &str) -> Result<Vec<MachineDef>, DataPackError> {
    let machines: Vec<MachineDef> = serde_json::from_str(json)?;
    for m in &machines {
        m.validate().map_err(DataPackError::InvalidManifest)?;
    }
    Ok(machines)
}

pub fn load_name_pool(json: &str) -> Result<NamePool, DataPackError> {
    Ok(serde_json::from_str(json)?)
}

pub fn load_scenarios(json: &str, defs: &Definitions) -> Result<Vec<ScenarioDef>, DataPackError> {
    let scenarios: Vec<ScenarioDef> = serde_json::from_str(json)?;
    for s in &scenarios {
        s.validate(defs).map_err(DataPackError::InvalidManifest)?;
    }
    Ok(scenarios)
}

pub fn load_into_definitions(
    defs: &mut Definitions,
    skills: Vec<SkillDef>,
    traits: Vec<TraitDef>,
    origins: Vec<OriginDef>,
    careers: Vec<CareerDef>,
    tags: Vec<TagDef>,
    resources: Vec<ResourceDef>,
    formations: Vec<FormationDef>,
    asteroid_types: Vec<AsteroidTypeDef>,
    ship_modules: Vec<ShipModuleDef>,
    machines: Vec<MachineDef>,
    name_pool: NamePool,
) {
    for skill in skills {
        let key = skill.id.clone();
        defs.skills.register(key, skill);
    }
    for tr in traits {
        let key = tr.id.clone();
        defs.traits.register(key, tr);
    }
    for origin in origins {
        let key = origin.id.clone();
        defs.origins.register(key, origin);
    }
    for career in careers {
        let key = career.id.clone();
        defs.careers.register(key, career);
    }
    for tag in tags {
        let key = tag.id.clone();
        defs.tags.register(key, tag);
    }
    for resource in resources {
        let key = resource.id.clone();
        defs.resources.register(key, resource);
    }
    for formation in formations {
        let key = formation.id.clone();
        defs.formations.register(key, formation);
    }
    for asteroid_type in asteroid_types {
        let key = asteroid_type.id.clone();
        defs.asteroid_types.register(key, asteroid_type);
    }
    for module in ship_modules {
        let key = module.id().clone();
        defs.ship_modules.register(key, module);
    }
    for machine in machines {
        let key = machine.id().clone();
        defs.machines.register(key, machine);
    }
    defs.name_pool = name_pool;
}

pub fn register_scenarios(defs: &mut Definitions, scenarios: Vec<ScenarioDef>) {
    for scenario in scenarios {
        let key = scenario.id.clone();
        defs.scenarios.register(key, scenario);
    }
}
