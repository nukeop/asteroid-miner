use asteroid_miner_types::{AsteroidTypeId, FormationId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MassClass {
    pub id: String,
    pub name_key: String,
    pub min_mass: f32,
    pub max_mass: f32,
    pub max_sites: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeightedFormation {
    pub formation: FormationId,
    pub weight: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AsteroidTypeDef {
    pub id: AsteroidTypeId,
    pub name_key: String,
    pub description_key: String,
    pub mass_classes: Vec<MassClass>,
    pub formations: Vec<WeightedFormation>,
}

impl AsteroidTypeDef {
    pub fn validate(&self) -> Result<(), String> {
        if self.mass_classes.is_empty() {
            return Err(format!(
                "Asteroid type '{}': mass_classes must not be empty",
                self.id.0
            ));
        }

        if self.formations.is_empty() {
            return Err(format!(
                "Asteroid type '{}': formations must not be empty",
                self.id.0
            ));
        }

        for mc in &self.mass_classes {
            if mc.min_mass > mc.max_mass {
                return Err(format!(
                    "Asteroid type '{}': mass class '{}' has min_mass {} > max_mass {}",
                    self.id.0, mc.id, mc.min_mass as u32, mc.max_mass as u32
                ));
            }
            if mc.max_sites < 1 {
                return Err(format!(
                    "Asteroid type '{}': mass class '{}' has max_sites {} (must be >= 1)",
                    self.id.0, mc.id, mc.max_sites
                ));
            }
        }

        for wf in &self.formations {
            if wf.weight <= 0.0 {
                return Err(format!(
                    "Asteroid type '{}': formation '{}' has weight {} (must be positive)",
                    self.id.0, wf.formation.0, wf.weight as i32
                ));
            }
        }

        Ok(())
    }
}
