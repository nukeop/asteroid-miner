import { useState } from 'react';

import { useDefinitionsStore } from '../stores/useDefinitionsStore';

export function useScenarioSelection() {
  const scenarios = useDefinitionsStore(
    (store) => store.definitions?.scenarios,
  )!;
  const scenarioList = Object.values(scenarios);

  const [selectedId, setSelectedId] = useState<string>(scenarioList[0].id);

  const selected = scenarios[selectedId];

  return {
    scenarioList,
    selectedId,
    selected,
    selectScenario: setSelectedId,
  };
}
