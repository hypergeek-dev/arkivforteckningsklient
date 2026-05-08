import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paragraph from './TextComponents';

describe('Paragraph component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Paragraph>Test</Paragraph>);
    expect(container).toBeInTheDocument();
  });

  it('renders single line text correctly', () => {
    const { getByText } = render(<Paragraph>Test</Paragraph>);
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('renders multiple lines of text correctly', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const { getByText } = render(<Paragraph>{text}</Paragraph>);
    expect(getByText('Line 1')).toBeInTheDocument();
    expect(getByText('Line 2')).toBeInTheDocument();
    expect(getByText('Line 3')).toBeInTheDocument();
  });

  it('applies custom styles correctly', () => {
    const customStyles = { color: 'red' };
    const { container } = render(
      <Paragraph sx={customStyles}>Styled Text</Paragraph>
    );
    expect(container.firstChild).toHaveStyle('color: red');
  });
});
