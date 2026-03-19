use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct NamePool {
    pub male_first: Vec<String>,
    pub female_first: Vec<String>,
    pub male_middle: Vec<String>,
    pub female_middle: Vec<String>,
    pub male_last: Vec<String>,
    pub female_last: Vec<String>,
}
