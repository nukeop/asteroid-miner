use asteroid_miner_types::SkillId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillDef {
    pub id: SkillId,
    pub name_key: String,
    pub description_key: String,
    pub xp_base: u32,
    pub xp_growth: f32,
}

impl SkillDef {
    pub fn xp_for_level(&self, level: u8) -> u32 {
        if level == 0 {
            return 0;
        }
        (self.xp_base as f32 * self.xp_growth.powi(level as i32 - 1)) as u32
    }
}
