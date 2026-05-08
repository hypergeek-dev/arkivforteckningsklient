import { getStatusString } from 'Common/constants';
import { displayDateWithTimezone } from 'Common/helper';
import {
  ClassificationStructureTypeNodeDto,
  OperationalAreaTypeNodeDto,
} from 'Models/index';
import { CommonNode } from 'Models/typed';
import Row from './Row';
import React from 'react';

export const CommonRowsStart: React.FC<{
  currentNode: CommonNode;
  compareNode?: CommonNode;
}> = ({ currentNode, compareNode }) => {
  const { status } = currentNode;
  const currentTimestamp = `${displayDateWithTimezone(currentNode.start)} - ${
    currentNode.stop ? displayDateWithTimezone(currentNode.stop) : 'Tillsvidare'
  }`;

  const comparedTimestamp = `${displayDateWithTimezone(currentNode.start)} - ${
    currentNode.stop ? displayDateWithTimezone(currentNode.stop) : 'Tillsvidare'
  }`;

  return (
    <>
      <Row
        header="Benämning"
        text={currentNode.name}
        compared={compareNode?.name}
      />
      <Row
        header="Status"
        text={getStatusString(status)}
        compared={compareNode?.status && getStatusString(compareNode?.status)}
      />

      <Row
        header="Gilltighetsstid"
        text={currentTimestamp}
        compared={comparedTimestamp}
      />
    </>
  );
};

export const CommonRowsEnd: React.FC<{
  currentNode: CommonNode;
  compareNode?: CommonNode;
}> = ({ currentNode, compareNode }) => (
  <Row
    header="Anmärkning"
    variant="caption"
    text={currentNode.remark}
    compared={compareNode?.remark}
  />
);

/**
 *
 *          KLASSIFICERINGSSTRUKTUR
 *
 */
export const KSRows: React.FC<{
  currentNode: ClassificationStructureTypeNodeDto;
  compareNode?: ClassificationStructureTypeNodeDto;
}> = ({ currentNode, compareNode }) => {
  return (
    <>
      <CommonRowsStart currentNode={currentNode} compareNode={compareNode} />
      <Row
        header="Myndighetens namn"
        text={currentNode.authName}
        compared={compareNode?.authName}
      />

      <Row
        header="Myndighetens Beslut"
        text={currentNode.authDecision}
        compared={compareNode?.authDecision}
      />
      <Row
        header="Versionsnummer"
        text={currentNode.csVersion ? `${currentNode.csVersion}` : 'Ej angivet'}
        compared={
          compareNode?.csVersion ? `${compareNode.csVersion}` : 'Ej angivet'
        }
      />

      <CommonRowsEnd compareNode={compareNode} currentNode={currentNode} />
    </>
  );
};

/**
 *
 *          VERKSAMHETSOMRÅDE
 *
 */
export const OARows: React.FC<{
  currentNode: OperationalAreaTypeNodeDto;
  compareNode?: OperationalAreaTypeNodeDto;
}> = ({ currentNode, compareNode }) => {
  return (
    <>
      <CommonRowsStart currentNode={currentNode} compareNode={compareNode} />
      <Row
        header="Myndighetens beslut"
        text={currentNode.authDecision}
        compared={compareNode?.authDecision}
      />
      <Row
        header="Informationsansvarig"
        text={currentNode.informationResponsible}
        compared={compareNode?.informationResponsible}
      />
      <Row
        header="Lagrum"
        text={currentNode.lawsection}
        compared={compareNode?.lawsection}
      />
      <CommonRowsEnd currentNode={currentNode} compareNode={compareNode} />
    </>
  );
};
