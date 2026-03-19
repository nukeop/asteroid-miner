use asteroid_miner_types::MachineId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "category")]
pub enum MachineDef {
    #[serde(rename = "mining_rig")]
    MiningRig {
        id: MachineId,
        name_key: String,
        description_key: String,
        hopper_capacity: f32,
        max_extraction_rate: f32,
        crew_slots: u32,
    },
    #[serde(rename = "scanning_rig")]
    ScanningRig {
        id: MachineId,
        name_key: String,
        description_key: String,
        accuracy: f32,
        crew_slots: u32,
    },
}

impl MachineDef {
    pub fn id(&self) -> &MachineId {
        match self {
            MachineDef::MiningRig { id, .. } | MachineDef::ScanningRig { id, .. } => id,
        }
    }

    pub fn validate(&self) -> Result<(), String> {
        match self {
            MachineDef::MiningRig {
                id,
                hopper_capacity,
                max_extraction_rate,
                crew_slots,
                ..
            } => {
                if *hopper_capacity <= 0.0 {
                    return Err(format!(
                        "Machine '{}': hopper_capacity must be > 0, got {}",
                        id.0, hopper_capacity
                    ));
                }
                if *max_extraction_rate <= 0.0 {
                    return Err(format!(
                        "Machine '{}': max_extraction_rate must be > 0, got {}",
                        id.0, max_extraction_rate
                    ));
                }
                if *crew_slots < 1 {
                    return Err(format!(
                        "Machine '{}': crew_slots must be >= 1, got {}",
                        id.0, crew_slots
                    ));
                }
                Ok(())
            }
            MachineDef::ScanningRig {
                id,
                accuracy,
                crew_slots,
                ..
            } => {
                if *accuracy <= 0.0 || *accuracy > 1.0 {
                    return Err(format!(
                        "Machine '{}': accuracy must be in (0.0, 1.0], got {}",
                        id.0, accuracy
                    ));
                }
                if *crew_slots < 1 {
                    return Err(format!(
                        "Machine '{}': crew_slots must be >= 1, got {}",
                        id.0, crew_slots
                    ));
                }
                Ok(())
            }
        }
    }
}
