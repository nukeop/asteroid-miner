import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TabBar } from './TabBar';
import type { TabBarLabels } from './types';

const labels: TabBarLabels = {
  map: 'Map',
  company: 'Company',
  market: 'Market',
  missions: 'Missions',
  hiring: 'Hiring',
  rivals: 'Rivals',
};

describe('TabBar', () => {
  it('renders all six tabs', () => {
    render(<TabBar activeTab="map" onTabChange={() => {}} labels={labels} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
  });

  it('fires onTabChange with the correct tab id', async () => {
    const onTabChange = vi.fn();
    render(
      <TabBar activeTab="map" onTabChange={onTabChange} labels={labels} />,
    );

    await userEvent.click(screen.getByRole('tab', { name: /market/i }));
    expect(onTabChange).toHaveBeenCalledWith('market');
  });

  it('marks the active tab as selected', () => {
    render(
      <TabBar activeTab="missions" onTabChange={() => {}} labels={labels} />,
    );

    expect(screen.getByRole('tab', { name: /missions/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: /map/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('(Snapshot) renders correctly', () => {
    const { container } = render(
      <TabBar activeTab="map" onTabChange={() => {}} labels={labels} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
