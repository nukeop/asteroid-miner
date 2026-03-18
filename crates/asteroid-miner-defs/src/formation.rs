use asteroid_miner_types::{FormationId, ResourceId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmbeddedResource {
    pub resource: ResourceId,
    pub probability: f32,
    pub min_grade: f32,
    pub max_grade: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormationDef {
    pub id: FormationId,
    pub name_key: String,
    pub description_key: String,
    pub matrix_resource: ResourceId,
    #[serde(default)]
    pub embedded_resources: Vec<EmbeddedResource>,
}

impl FormationDef {
    pub fn validate(&self) -> Result<(), String> {
        for er in &self.embedded_resources {
            if er.probability < 0.0 || er.probability > 1.0 {
                return Err(format!(
                    "Formation '{}': embedded resource '{}' has probability {} outside [0.0, 1.0]",
                    self.id.0, er.resource.0, er.probability
                ));
            }
            if er.min_grade > er.max_grade {
                return Err(format!(
                    "Formation '{}': embedded resource '{}' has min_grade {} > max_grade {}",
                    self.id.0, er.resource.0, er.min_grade, er.max_grade
                ));
            }
        }

        let max_grade_sum: f32 = self.embedded_resources.iter().map(|er| er.max_grade).sum();
        if max_grade_sum > 1.0 {
            return Err(format!(
                "Formation '{}': sum of max_grades is {} (must be <= 1.0)",
                self.id.0, max_grade_sum
            ));
        }

        Ok(())
    }
}
