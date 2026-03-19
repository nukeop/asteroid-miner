use asteroid_miner_types::*;
use serde::{Deserialize, Serialize};

use crate::registry::Registry;
use crate::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Definitions {
    pub skills: Registry<SkillId, SkillDef>,
    pub traits: Registry<TraitId, TraitDef>,
    pub origins: Registry<OriginId, OriginDef>,
    pub careers: Registry<CareerId, CareerDef>,
    pub tags: Registry<TagId, TagDef>,
    pub resources: Registry<ResourceId, ResourceDef>,
    pub formations: Registry<FormationId, FormationDef>,
    pub asteroid_types: Registry<AsteroidTypeId, AsteroidTypeDef>,
    pub ship_modules: Registry<ShipModuleId, ShipModuleDef>,
    pub machines: Registry<MachineId, MachineDef>,
}

impl Definitions {
    pub fn new() -> Self {
        Self {
            skills: Registry::new(),
            traits: Registry::new(),
            origins: Registry::new(),
            careers: Registry::new(),
            tags: Registry::new(),
            resources: Registry::new(),
            formations: Registry::new(),
            asteroid_types: Registry::new(),
            ship_modules: Registry::new(),
            machines: Registry::new(),
        }
    }
}

impl Default for Definitions {
    fn default() -> Self {
        Self::new()
    }
}
