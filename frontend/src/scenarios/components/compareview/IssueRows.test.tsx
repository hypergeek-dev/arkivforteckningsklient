import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IssueRows } from './IssueRows';
import { IssueTypeNodeDto } from 'Models/index';
import { issueTypeArray } from '../../../mocks/issueType';

const renderIssueRows = (row: React.ReactNode) => {
  return render(
    <table>
      <tbody>{row}</tbody>
    </table>
  );
};

describe('IssueRows', () => {
  const currentNode: IssueTypeNodeDto = issueTypeArray[0];

  const compareNode: IssueTypeNodeDto = {
    ...issueTypeArray[0],
    status: 'utkast',
    updated: '2021-09-01',
    createdAt: '2021-09-01',
    register: false,
  };

  it('renders without crashing', () => {
    renderIssueRows(
      <IssueRows currentNode={currentNode} compareNode={compareNode} />
    );
  });

  it('displays correct registration status', () => {
    const { getAllByText } = renderIssueRows(
      <IssueRows currentNode={currentNode} compareNode={compareNode} />
    );
    expect(getAllByText('Registreras')).toHaveLength(2);
  });

  it('renders CommonRowsStart and CommonRowsEnd components', () => {
    const { getAllByText } = renderIssueRows(
      <IssueRows currentNode={currentNode} compareNode={compareNode} />
    );
    expect(getAllByText('Benämning')).toHaveLength(2);
    expect(getAllByText('Anmärkning')).toHaveLength(2);
  });

  it('renders RelationsRows component', () => {
    const { getAllByText } = renderIssueRows(
      <IssueRows currentNode={currentNode} compareNode={compareNode} />
    );
    expect(getAllByText('Inga relationer')).toHaveLength(2);
  });
});
