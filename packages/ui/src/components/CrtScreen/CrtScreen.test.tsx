import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CrtScreen } from './CrtScreen';

describe('CrtScreen', () => {
  it('renders children', () => {
    render(<CrtScreen>Drill status: ONLINE</CrtScreen>);
    expect(screen.getByText('Drill status: ONLINE')).toBeInTheDocument();
  });

  it('(Snapshot) default rendering', () => {
    const { container } = render(<CrtScreen>Phosphor content</CrtScreen>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) green theme rendering', () => {
    const { container } = render(
      <div data-theme="green">
        <CrtScreen>Green phosphor content</CrtScreen>
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('passes extra props to the root element', () => {
    render(
      <CrtScreen data-testid="crt" aria-label="status monitor">
        content
      </CrtScreen>,
    );
    const el = screen.getByTestId('crt');
    expect(el).toHaveAttribute('aria-label', 'status monitor');
  });
});
