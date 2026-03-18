use asteroid_miner_types::{ResourceId, TagId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TagDef {
    pub id: TagId,
    pub name_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceDef {
    pub id: ResourceId,
    pub name_key: String,
    pub description_key: String,
    #[serde(default)]
    pub tags: Vec<TagId>,
}
