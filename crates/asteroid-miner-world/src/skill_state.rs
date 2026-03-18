use serde::{Deserialize, Serialize};

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
