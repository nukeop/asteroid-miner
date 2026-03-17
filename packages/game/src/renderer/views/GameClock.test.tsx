import { describe, expect, it } from 'vitest';

import { GameClockWrapper } from './GameClock.test-wrapper';

describe('Game clock', () => {
  it('shows the starting date on first load', async () => {
    await GameClockWrapper.mount();

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '1st of Yanvar, 2022',
    );
  });

  it('advances to the next day when clicking Advance Day', async () => {
    await GameClockWrapper.mount();

    await GameClockWrapper.advanceDay.click();

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '2nd of Yanvar, 2022',
    );
  });

  it('rolls over to the next month after day 30', async () => {
    await GameClockWrapper.mount();
    GameClockWrapper.setTurn(30);

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '30th of Yanvar, 2022',
    );

    await GameClockWrapper.advanceDay.click();

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '1st of Fevral, 2022',
    );
  });

  it('rolls over to the next year after Dekabr 30', async () => {
    await GameClockWrapper.mount();
    GameClockWrapper.setTurn(360);

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '30th of Dekabr, 2022',
    );

    await GameClockWrapper.advanceDay.click();

    expect(GameClockWrapper.topBarDate).toHaveTextContent(
      '1st of Yanvar, 2023',
    );
  });
});
