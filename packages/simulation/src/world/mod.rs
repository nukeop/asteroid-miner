use serde::{Deserialize, Serialize};
use slotmap::SlotMap;

use crate::pawn::*;
use crate::registry::Registry;

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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub defs: Definitions,
    pub pawns: SlotMap<PawnId, Pawn>,
    pub turn: u32,
}

impl GameState {
    pub fn new(defs: Definitions) -> Self {
        Self {
            defs,
            pawns: SlotMap::with_key(),
            turn: 0,
        }
    }
}

#[cfg(test)]
mod world_test;
