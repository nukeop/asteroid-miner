use asteroid_miner_types::{CareerId, OriginId, SkillId};
use serde::{Deserialize, Serialize};

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
    #[serde(default)]
    pub skill_bonuses: Vec<StartingBonus<SkillId>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CareerDef {
    pub id: CareerId,
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub skill_bonuses: Vec<StartingBonus<SkillId>>,
}
