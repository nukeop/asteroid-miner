import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ZoneMap, type ZoneMapConnection, type ZoneMapZone } from './ZoneMap';

const zones: ZoneMapZone[] = [
  { id: 'leo', name: 'Low Earth Orbit', position: { x: 10, y: 75 } },
  { id: 'llo', name: 'Low Lunar Orbit', position: { x: 85, y: 25 } },
];

const connections: ZoneMapConnection[] = [
  { id: 'leo__llo', zoneIds: ['leo', 'llo'], label: 'Δv 3.1 · 2d' },
];

describe('ZoneMap', () => {
  it('renders zone names and connection labels', () => {
    render(
      <ZoneMap
        zones={zones}
        connections={connections}
        selectedZoneId={null}
        onSelectZone={vi.fn()}
      />,
    );

    expect(screen.getByText('Low Earth Orbit')).toBeVisible();
    expect(screen.getByText('Low Lunar Orbit')).toBeVisible();
    expect(screen.getByText('Δv 3.1 · 2d')).toBeVisible();
  });

  it('calls onSelectZone with the zone id when a zone is clicked', () => {
    const onSelectZone = vi.fn();
    render(
      <ZoneMap
        zones={zones}
        connections={connections}
        selectedZoneId={null}
        onSelectZone={onSelectZone}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Low Lunar Orbit' }));

    expect(onSelectZone).toHaveBeenCalledWith('llo');
  });

  it('(Snapshot) renders the selected ring around the selected zone', () => {
    const { container } = render(
      <ZoneMap
        zones={zones}
        connections={connections}
        selectedZoneId="llo"
        onSelectZone={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
