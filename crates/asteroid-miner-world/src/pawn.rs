use asteroid_miner_types::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::SkillState;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pawn {
    pub id: PawnId,
    pub first_name: String,
    pub last_name: String,
    pub nickname: Option<String>,
    pub age: u16,
    pub sex: Sex,

    pub origin: OriginId,
    pub career: CareerId,

    pub traits: Vec<TraitId>,
    pub skills: HashMap<SkillId, SkillState>,
}
