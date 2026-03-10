pub mod pawn;
pub mod registry;
pub mod world;

use wasm_bindgen::prelude::*;

fn ping_json() -> String {
    let response = serde_json::json!({
        "status": "ok",
        "engine": "asteroid-miner-simulation",
        "version": env!("CARGO_PKG_VERSION"),
    });

    serde_json::to_string(&response).expect("serialization should not fail")
}

#[wasm_bindgen]
pub fn ping() -> String {
    ping_json()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ping_returns_valid_json() {
        let json_str = ping_json();
        let parsed: serde_json::Value = serde_json::from_str(&json_str).unwrap();

        assert_eq!(parsed["status"], "ok");
        assert_eq!(parsed["engine"], "asteroid-miner-simulation");
    }
}
