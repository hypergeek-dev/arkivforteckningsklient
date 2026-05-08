import { Typography } from '@mui/material';
import { getInformationSecurityText } from 'Common/helper';
import { DocumentTypeNodeDto } from 'Models/index';
import Row from './Row';
import React from 'react';
import { CommonRowsEnd, CommonRowsStart } from './MappedRow';

export const DocumentRows: React.FC<{
  currentNode: DocumentTypeNodeDto;
  compareNode?: DocumentTypeNodeDto | undefined;
}> = ({ currentNode, compareNode }) => {
  const currentInfoSecClass =
    getInformationSecurityText(currentNode.informationsecurityclass) ?? '';

  const comparedInfoSecClass = compareNode
    ? getInformationSecurityText(compareNode?.informationsecurityclass)
    : '';
  return (
    <>
      <CommonRowsStart currentNode={currentNode} compareNode={compareNode} />

      <Row
        header="Informationsklassning"
        text={currentInfoSecClass}
        compared={comparedInfoSecClass}
      />

      <Row
        header="Hanterar personuppgifter"
        text={currentNode.personalData ? 'Ja' : 'Nej'}
        compared={compareNode?.personalData ? 'Ja' : 'Nej'}
      />

      <Row
        header="Sekretess"
        text={currentNode.secrecy ? 'Ja' : 'Nej'}
        compared={compareNode?.secrecy ? 'Ja' : 'Nej'}
      />

      <Row
        header="Lagrum för sekretess"
        variant="caption"
        text={currentNode.secrecyLawsection}
        compared={compareNode?.secrecyLawsection ?? ''}
      />

      <DocumentRegulationRow
        currentNode={currentNode}
        compareNode={compareNode}
      />
      <Row
        header="Registreras"
        text={currentNode.register ? 'Ja' : 'Nej'}
        compared={compareNode?.register ? 'Ja' : 'Nej'}
      />
      <Row
        header="Krav på underskrift"
        text={currentNode.signatureRequired ? 'Ja' : 'Nej'}
        compared={compareNode?.signatureRequired ? 'Ja' : 'Nej'}
      />

      {/* <Row
        header="Förvaringsenhet"
        text={currentNode.keepingUnit}
        compared={compareNode && compareNode.keepingUnit}
      /> */}

      <CommonRowsEnd compareNode={compareNode} currentNode={currentNode} />
    </>
  );
};

/**
 *
 *          GALLRINGSREGLER
 *
 */
const DocumentRegulationRow: React.FC<{
  currentNode: DocumentTypeNodeDto;
  compareNode?: DocumentTypeNodeDto | undefined;
}> = ({ currentNode, compareNode }) => {
  const assignedRules = currentNode.assignedRules ?? [];

  const compareRules = compareNode?.assignedRules ?? [];

  const current = assignedRules.map((rule) => (
    <Typography key={`current-${rule.uuid}`} component={'p'} variant="caption">
      {rule.description}
    </Typography>
  ));

  const compared = compareRules.map((rule) => (
    <Typography
      key={`compared-${rule.uuid}`}
      variant="caption"
      component={'p'}
      /* color={assignedRules.find((item) => item.id === rule.id) ? '#333' : 'red'} */
    >
      {rule.description}
    </Typography>
  ));

  return (
    <>
      <Row
        header="Gallringsregel"
        text={current.length === 0 ? 'Ingen regel' : <>{current} </>}
        compared={
          compareNode ? (
            compared.length === 0 ? (
              'Ingen regel'
            ) : (
              <>{compared}</>
            )
          ) : (
            ''
          )
        }
      />
      <Row
        header="Lagrum för gallringsregel"
        variant="caption"
        text={current.length === 0 ? '-' : <>{currentNode.regulation}</>}
        compared={
          compareNode ? (
            compared.length === 0 ? (
              '-'
            ) : (
              <>{compareNode.regulation}</>
            )
          ) : (
            ''
          )
        }
      />
    </>
  );
};
