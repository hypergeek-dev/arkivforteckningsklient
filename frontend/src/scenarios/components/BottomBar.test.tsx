import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import BottomBar from './BottomBar';

describe('BottomBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<BottomBar />);
    expect(container).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <BottomBar>
        <div>Test Child</div>
      </BottomBar>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('has the correct position and color', () => {
    const { container } = render(<BottomBar />);
    const appBar = container.querySelector('.MuiAppBar-root');
    expect(appBar).toHaveStyle('position: fixed');
    expect(appBar).toHaveStyle('top: auto');
    expect(appBar).toHaveStyle('bottom: 0');
    expect(appBar).toHaveClass('MuiAppBar-colorPrimary');
  });
});
