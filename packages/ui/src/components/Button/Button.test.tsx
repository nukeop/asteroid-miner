import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders and responds to clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Engage</Button>);

    const button = screen.getByRole('button', { name: 'Engage' });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
