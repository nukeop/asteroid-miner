use serde::{Deserialize, Serialize};

use super::types::SkillId;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillDef {
    pub id: SkillId,
    pub name: String,
    pub description: String,
    pub max_level: u8,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillState {
    pub level: u8,
    pub xp: u32,
}

impl SkillState {
    pub fn new() -> Self {
        Self { level: 0, xp: 0 }
    }

    pub fn with_level(level: u8) -> Self {
        Self { level, xp: 0 }
    }
}

impl Default for SkillState {
    fn default() -> Self {
        Self::new()
    }
}
