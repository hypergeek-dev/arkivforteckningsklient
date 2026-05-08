import { IssueTypeNodeDto } from 'Models/index';
import Row from './Row';
import React from 'react';
import { CommonRowsEnd, CommonRowsStart } from './MappedRow';
import { RelationsRows } from './RelationsRow';

export const IssueRows: React.FC<{
  currentNode: IssueTypeNodeDto;
  compareNode: IssueTypeNodeDto | undefined;
}> = ({ currentNode, compareNode }) => {
  return (
    <>
      <CommonRowsStart currentNode={currentNode} compareNode={compareNode} />
      <Row
        header="Registreras"
        text={currentNode.register ? 'Ja' : 'Nej'}
        compared={compareNode?.register ? 'Ja' : 'Nej'}
      />

      <RelationsRows
        currentRelations={currentNode.relations}
        comparedRelations={compareNode?.relations}
      />

      <CommonRowsEnd currentNode={currentNode} compareNode={compareNode} />
    </>
  );
};
