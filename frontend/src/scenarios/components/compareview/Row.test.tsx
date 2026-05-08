import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Row from './Row';

const renderRow = (
  header: string,
  text?: string,
  compared?: React.ReactNode
) => {
  return render(
    <table>
      <tbody>
        <Row header={header} text={text} compared={compared} />
      </tbody>
    </table>
  );
};

describe('Row Component', () => {
  it('renders header and text correctly', () => {
    const { getAllByText } = renderRow('Header', 'Text');
    expect(getAllByText('Header')).toHaveLength(2);
    expect(getAllByText('Text')).toHaveLength(1);
  });

  it('renders "Ej angivet" when text is not provided', () => {
    const { getAllByText } = renderRow('Header');
    expect(getAllByText('Header')).toHaveLength(2);
    expect(getAllByText('Ej angivet')).toHaveLength(2);
  });

  it('renders compared text correctly', () => {
    const { getAllByText } = renderRow('Header', 'Compared Text');
    expect(getAllByText('Header')).toHaveLength(2);
    expect(getAllByText('Compared Text')).toHaveLength(1);
  });

  it('renders "Ej angivet" when compared text is not provided', () => {
    const { getAllByText } = renderRow('Header');
    expect(getAllByText('Header')).toHaveLength(2);
    expect(getAllByText('Ej angivet')).toHaveLength(2);
  });

  it('shows asterisk when text and compared text differ', () => {
    const { getByText } = renderRow('Header', 'Text', 'Different Text');
    expect(getByText('*')).toBeInTheDocument();
  });

  it('does not show asterisk when text and compared text are the same', () => {
    const { queryByText } = renderRow('Header', 'Text', 'Text');
    expect(queryByText('*')).not.toBeInTheDocument();
  });
});
