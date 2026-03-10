use serde::{Deserialize, Serialize};

use super::types::DispositionId;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DispositionDef {
    pub id: DispositionId,
    pub name: String,
    pub description: String,
    pub low_label: String,
    pub high_label: String,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct DispositionState {
    pub value: u8,
}

impl DispositionState {
    pub fn new(value: u8) -> Self {
        Self {
            value: value.clamp(1, 5),
        }
    }
}
