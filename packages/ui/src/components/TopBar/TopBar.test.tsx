import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('(Snapshot) matches snapshot', () => {
    const { container } = render(
      <TopBar>
        <span>Test content</span>
      </TopBar>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
