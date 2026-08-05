import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ZoneDetailPanel } from './ZoneDetailPanel';

describe('ZoneDetailPanel', () => {
  it('(Snapshot) renders the zone name, description, and contents', () => {
    const { container } = render(
      <ZoneDetailPanel
        name="Low Lunar Orbit"
        description="Orbit around the Moon at low altitude."
        labels={{
          contentsHeading: 'Contents',
          discoveredAsteroidCount: '2 discovered asteroids',
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
