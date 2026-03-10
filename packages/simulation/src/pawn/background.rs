use serde::{Deserialize, Serialize};

use super::types::{CareerId, DispositionId, OriginId, SkillId};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartingBonus<Id> {
    pub id: Id,
    pub amount: i8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OriginDef {
    pub id: OriginId,
    pub name: String,
    pub description: String,
    pub skill_bonuses: Vec<StartingBonus<SkillId>>,
    pub disposition_bonuses: Vec<StartingBonus<DispositionId>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CareerDef {
    pub id: CareerId,
    pub name: String,
    pub description: String,
    pub skill_bonuses: Vec<StartingBonus<SkillId>>,
    pub disposition_bonuses: Vec<StartingBonus<DispositionId>>,
}
