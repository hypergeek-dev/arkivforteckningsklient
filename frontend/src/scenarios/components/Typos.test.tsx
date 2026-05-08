import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageHeading } from './Typos';

describe('PageHeading component', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageHeading>Test Heading</PageHeading>);
    expect(container).toBeInTheDocument();
  });

  it('renders the correct text', () => {
    const { getByText } = render(<PageHeading>Test Heading</PageHeading>);
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies custom styles correctly', () => {
    const customStyles = { color: 'red' };
    const { container } = render(
      <PageHeading style={customStyles}>Styled Heading</PageHeading>
    );
    expect(container.firstChild).toHaveStyle('color: red');
  });

  it('applies default styles correctly', () => {
    const { container } = render(
      <PageHeading>Default Styled Heading</PageHeading>
    );
    expect(container.firstChild).toHaveStyle(
      'font: normal normal 900 26px/37px Arial'
    );
    expect(container.firstChild).toHaveStyle('margin-bottom: 2rem');
  });
});
