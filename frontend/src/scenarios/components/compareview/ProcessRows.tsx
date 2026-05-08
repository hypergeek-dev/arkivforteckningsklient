import React from 'react';
import { ProcessGroupTypeNodeDto, ProcessTypeNodeDto } from 'Models/index';
import Row from './Row';
import { CommonRowsEnd, CommonRowsStart } from './MappedRow';
import { RelationsRows } from './RelationsRow';

export const ProcessRows: React.FC<{
  currentNode: ProcessTypeNodeDto | ProcessGroupTypeNodeDto;
  compareNode?: ProcessTypeNodeDto | ProcessGroupTypeNodeDto | undefined;
}> = ({ currentNode, compareNode }) => {
  return (
    <>
      <CommonRowsStart currentNode={currentNode} compareNode={compareNode} />
      <Row
        header="Informationsansvarig"
        text={currentNode.informationResponsible}
        compared={compareNode && compareNode.informationResponsible}
      />
      <Row
        header="Konaktperson"
        text={currentNode.contact}
        compared={compareNode && compareNode.contact}
      />
      <RelationsRows
        currentRelations={currentNode.relations}
        comparedRelations={compareNode?.relations}
      />
      <CommonRowsEnd currentNode={currentNode} compareNode={compareNode} />
    </>
  );
};
