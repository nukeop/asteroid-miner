import { describe, expect, it } from 'vitest';

import { MapViewWrapper } from './MapView.test-wrapper';

describe('MapView', () => {
  it('shows all zones and travel costs', async () => {
    await MapViewWrapper.mount();

    expect(MapViewWrapper.zone('Low Earth Orbit')).toBeVisible();
    expect(MapViewWrapper.zone('Lunar Transfer Orbit')).toBeVisible();
    expect(MapViewWrapper.zone('High Lunar Orbit')).toBeVisible();
    expect(MapViewWrapper.zone('Low Lunar Orbit')).toBeVisible();

    expect(MapViewWrapper.connectionLabel('Δv 3.1 · 2d')).toBeVisible();
    expect(MapViewWrapper.connectionLabel('Δv 0.7 · 2d')).toBeVisible();
    expect(MapViewWrapper.connectionLabel('Δv 0.8 · 1d')).toBeVisible();
  });

  it('shows zone details when a zone is selected', async () => {
    await MapViewWrapper.mount();

    expect(MapViewWrapper.queryDetailPanel()).toBeNull();

    await MapViewWrapper.selectZone('Low Lunar Orbit');

    const panel = MapViewWrapper.detailPanel;
    expect(panel).toHaveTextContent('Low Lunar Orbit');
    expect(panel).toHaveTextContent('Orbit around the Moon at low altitude.');
    expect(panel).toHaveTextContent('Contents');
    expect(panel).toHaveTextContent('0 discovered asteroids');
  });

  it('swaps the panel when another zone is selected', async () => {
    await MapViewWrapper.mount();

    await MapViewWrapper.selectZone('Low Lunar Orbit');
    await MapViewWrapper.selectZone('Low Earth Orbit');

    const panel = MapViewWrapper.detailPanel;
    expect(panel).toHaveTextContent('Low Earth Orbit');
    expect(panel).toHaveTextContent('Orbit around Earth at low altitude.');
    expect(panel).not.toHaveTextContent(
      'Orbit around the Moon at low altitude.',
    );
  });

  it('shows the number of discovered asteroids', async () => {
    await MapViewWrapper.mount();
    MapViewWrapper.setDiscoveredAsteroids('llo', 2);

    await MapViewWrapper.selectZone('Low Lunar Orbit');

    expect(MapViewWrapper.detailPanel).toHaveTextContent(
      '2 discovered asteroids',
    );
  });
});
