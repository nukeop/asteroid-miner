import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { GameShell } from './GameShell';

const defaultProps = {
  companyName: 'Kuiper Industrial',
  labels: {
    topBar: { day: 'Day 47', credits: '12,450 CR' },
    tabs: {
      map: 'Map',
      company: 'Company',
      market: 'Market',
      missions: 'Missions',
      hiring: 'Hiring',
      rivals: 'Rivals',
    },
  },
};

describe('GameShell', () => {
  it('switches panels when clicking tabs', async () => {
    render(<GameShell {...defaultProps} />);

    expect(screen.getByRole('main')).toHaveTextContent('Map');

    await userEvent.click(screen.getByRole('tab', { name: /missions/i }));
    expect(screen.getByRole('main')).toHaveTextContent('Missions');
  });

  it('renders custom tab panel content when provided', () => {
    render(
      <GameShell
        {...defaultProps}
        tabPanels={{ map: <div>Star chart goes here</div> }}
      />,
    );

    expect(screen.getByText('Star chart goes here')).toBeInTheDocument();
  });

  it('(Snapshot) renders with default props', () => {
    const { container } = render(<GameShell {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
