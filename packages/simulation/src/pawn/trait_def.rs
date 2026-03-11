use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::types::{SkillId, TraitId};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TraitDef {
    pub id: TraitId,
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub skill_modifiers: Vec<SkillModifier>,
    #[serde(default)]
    pub custom_effects: Vec<CustomEffect>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ModifierOp {
    Flat,
    Factor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillModifier {
    pub skill: SkillId,
    pub op: ModifierOp,
    pub value: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomEffect {
    pub handler: String,
    pub params: HashMap<String, serde_json::Value>,
}
