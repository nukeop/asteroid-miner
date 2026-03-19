use asteroid_miner_defs::Definitions;
use asteroid_miner_types::PawnId;
use serde::{Deserialize, Serialize};
use slotmap::SlotMap;

use crate::Pawn;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub defs: Definitions,
    pub pawns: SlotMap<PawnId, Pawn>,
    pub turn: u32,
}

impl GameState {
    pub fn new(defs: Definitions) -> Self {
        Self {
            defs,
            pawns: SlotMap::with_key(),
            turn: 0,
        }
    }

    pub fn add_pawn(&mut self, mut pawn: Pawn) -> PawnId {
        self.pawns.insert_with_key(|key| {
            pawn.id = key;
            pawn
        })
    }
}
