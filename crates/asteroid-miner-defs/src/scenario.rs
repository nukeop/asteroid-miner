use std::collections::HashMap;

use asteroid_miner_types::{CareerId, OriginId, ScenarioId, Sex, SkillId};
use serde::{Deserialize, Serialize};

use crate::Definitions;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrewTemplate {
    #[serde(default)]
    pub origins_whitelist: Vec<OriginId>,
    #[serde(default)]
    pub careers_whitelist: Vec<CareerId>,
    pub sex: Option<Sex>,
    pub age: [u16; 2],
    pub skills: HashMap<SkillId, [u8; 2]>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScenarioDef {
    pub id: ScenarioId,
    pub name_key: String,
    pub description_key: String,
    pub crew: Vec<CrewTemplate>,
}

impl ScenarioDef {
    pub fn validate(&self, defs: &Definitions) -> Result<(), String> {
        if self.crew.is_empty() {
            return Err(format!("scenario '{}': crew list is empty", self.id.0));
        }

        for (i, template) in self.crew.iter().enumerate() {
            for origin_id in &template.origins_whitelist {
                if !defs.origins.contains(origin_id) {
                    return Err(format!(
                        "scenario '{}' crew[{}]: unknown origin '{}'",
                        self.id.0, i, origin_id.0
                    ));
                }
            }

            for career_id in &template.careers_whitelist {
                if !defs.careers.contains(career_id) {
                    return Err(format!(
                        "scenario '{}' crew[{}]: unknown career '{}'",
                        self.id.0, i, career_id.0
                    ));
                }
            }

            for (skill_id, range) in &template.skills {
                if !defs.skills.contains(skill_id) {
                    return Err(format!(
                        "scenario '{}' crew[{}]: unknown skill '{}'",
                        self.id.0, i, skill_id.0
                    ));
                }
                if range[0] > range[1] {
                    return Err(format!(
                        "scenario '{}' crew[{}]: skill '{}' min ({}) > max ({})",
                        self.id.0, i, skill_id.0, range[0], range[1]
                    ));
                }
            }

            if template.age[0] > template.age[1] {
                return Err(format!(
                    "scenario '{}' crew[{}]: age min ({}) > max ({})",
                    self.id.0, i, template.age[0], template.age[1]
                ));
            }
        }

        Ok(())
    }
}
