import { describe, expect, it } from 'vitest';

import { NewScenarioWrapper } from './NewScenario.test-wrapper';

describe('New scenario', () => {
  it('(Snapshot) scenario selection shows available scenarios', async () => {
    await NewScenarioWrapper.mount();

    expect(NewScenarioWrapper.scenarioSelection.view).toMatchSnapshot();
  });

  it('(Snapshot) crew review shows generated crew from the scenario', async () => {
    await NewScenarioWrapper.mount();
    await NewScenarioWrapper.scenarioSelection.clickNext();

    expect(NewScenarioWrapper.crewReview.view).toMatchSnapshot();
  });

  it('rerolls a crew member and shows different data', async () => {
    await NewScenarioWrapper.mount();
    await NewScenarioWrapper.scenarioSelection.clickNext();

    const detailBefore =
      NewScenarioWrapper.crewReview.selectedCrewDetail.textContent;

    await NewScenarioWrapper.crewReview.clickReroll();

    expect(
      NewScenarioWrapper.crewReview.selectedCrewDetail.textContent,
    ).not.toBe(detailBefore);
  });

  it('going back from crew review returns to scenario selection', async () => {
    await NewScenarioWrapper.mount();
    await NewScenarioWrapper.scenarioSelection.clickNext();
    await NewScenarioWrapper.crewReview.clickBack();

    expect(NewScenarioWrapper.scenarioSelection.view).toBeInTheDocument();
  });

  it('starting the game navigates to the game map', async () => {
    await NewScenarioWrapper.mount();
    await NewScenarioWrapper.scenarioSelection.clickNext();
    await NewScenarioWrapper.crewReview.clickStart();

    expect(NewScenarioWrapper.gameLayout).toBeInTheDocument();
  });
});
