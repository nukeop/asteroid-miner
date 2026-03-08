import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TopBar } from './TopBar';

const defaultProps = {
  companyName: 'Kuiper Industrial',
  labels: { day: 'Day 47', credits: '12,450 CR' },
};

describe('TopBar', () => {
  it('(Snapshot) renders company name, day, and credits', () => {
    render(<TopBar {...defaultProps} />);

    expect(screen.getByText('Kuiper Industrial')).toBeInTheDocument();
    expect(screen.getByText('Day 47')).toBeInTheDocument();
    expect(screen.getByText('12,450 CR')).toBeInTheDocument();
  });

  it('(Snapshot) matches snapshot', () => {
    const { container } = render(<TopBar {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
