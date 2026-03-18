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
}

impl Definitions {
    pub fn new() -> Self {
        Self {
            skills: Registry::new(),
            traits: Registry::new(),
            origins: Registry::new(),
            careers: Registry::new(),
        }
    }
}

impl Default for Definitions {
    fn default() -> Self {
        Self::new()
    }
}
