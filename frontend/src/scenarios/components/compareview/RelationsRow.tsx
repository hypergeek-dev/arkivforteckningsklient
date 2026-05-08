import React from 'react';
import { NodeRelationDto } from 'Models/index';
import { Typography } from '@mui/material';
import Row from './Row';

export const RelationsRows: React.FC<{
  currentRelations?: NodeRelationDto[];
  comparedRelations?: NodeRelationDto[];
}> = ({ currentRelations, comparedRelations }) => {
  const current = currentRelations?.map((relation) => (
    <Typography
      key={`current-${relation.id}`}
      component={'p'}
      variant="caption"
    >
      {relation.relatedPath?.substring(
        relation.relatedPath.slice(1).indexOf('/') + 2
      )}
    </Typography>
  ));

  const compared = comparedRelations?.map((relation) => (
    <Typography
      key={`compared-${relation.id}`}
      component={'p'}
      variant="caption"
    >
      {relation.relatedPath?.substring(
        relation.relatedPath.slice(1).indexOf('/') + 2
      )}
    </Typography>
  ));

  return (
    <Row
      header="Relationer"
      text={current?.length !== 0 ? <>{current}</> : 'Inga relationer'}
      compared={compared?.length !== 0 ? <>{compared}</> : 'Inga relationer'}
    />
  );
};
