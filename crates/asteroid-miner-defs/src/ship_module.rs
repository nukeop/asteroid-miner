use asteroid_miner_types::ShipModuleId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "category")]
pub enum ShipModuleDef {
    #[serde(rename = "bridge")]
    Bridge {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
    },
    #[serde(rename = "reactor")]
    Reactor {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
    },
    #[serde(rename = "engine")]
    Engine {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
        speed: f32,
        fuel_efficiency: f32,
    },
    #[serde(rename = "fuel_tank")]
    FuelTank {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
        capacity: f32,
    },
    #[serde(rename = "crew_quarters")]
    CrewQuarters {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
    },
    #[serde(rename = "cargo_bay")]
    CargoBay {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
        capacity: f32,
    },
    #[serde(rename = "scanner")]
    Scanner {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
        sensitivity: f32,
    },
    #[serde(rename = "machine_bay")]
    MachineBay {
        id: ShipModuleId,
        name_key: String,
        description_key: String,
    },
}

impl ShipModuleDef {
    pub fn id(&self) -> &ShipModuleId {
        match self {
            ShipModuleDef::Bridge { id, .. }
            | ShipModuleDef::Reactor { id, .. }
            | ShipModuleDef::Engine { id, .. }
            | ShipModuleDef::FuelTank { id, .. }
            | ShipModuleDef::CrewQuarters { id, .. }
            | ShipModuleDef::CargoBay { id, .. }
            | ShipModuleDef::Scanner { id, .. }
            | ShipModuleDef::MachineBay { id, .. } => id,
        }
    }
}
