import { Chip } from '@mui/material';
import { actions } from 'Store/ducks/app';
import { RegulationFilterTypes } from 'Store/ducks/app/reducer';
import { selectRegulationFilter } from 'Store/ducks/app/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';

interface RegulationFilterProps {
  disabled: boolean;
}

export default function RegulationFilter({
  disabled,
}: Readonly<RegulationFilterProps>) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectRegulationFilter);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = e.currentTarget.attributes.getNamedItem('id')?.value as
      | RegulationFilterTypes
      | undefined;
    if (id) {
      dispatch(actions.setRegulationFilter(id));
      const match = id.match(/\d/gm);
      if (match) {
        const a = parseInt(match[0]);
        let b = 100;
        if (match.length === 2) {
          b = parseInt(match[1]);
        }

        dispatch(actions.fetchByFilter([[a, b]]));
      } else if (id === 'filter-Ref') {
        dispatch(actions.fetchByType('TEXT_RULE'));
      } else if (id === 'alla') {
        dispatch(actions.fetchByFilter([[0, 1000]]));
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.25rem',
        height: 'inherit',
        alignItems: 'center',
      }}
    >
      <Chip
        id={'alla'}
        color={selected.includes('alla') ? 'primary' : 'default'}
        label="Alla"
        size="small"
        onClick={!disabled ? handleClick : undefined}
      />
      <Chip
        id={'filter-0-3'}
        color={selected.includes('filter-0-3') ? 'primary' : 'default'}
        label="0-3 år"
        size="small"
        onClick={!disabled ? handleClick : undefined}
      />
      <Chip
        id={'filter-3-5'}
        color={selected.includes('filter-3-5') ? 'primary' : 'default'}
        label="3-5 år"
        size="small"
        onClick={!disabled ? handleClick : undefined}
      />
      <Chip
        id={'filter-5+'}
        color={selected.includes('filter-5+') ? 'primary' : 'default'}
        label="5+ år"
        size="small"
        onClick={!disabled ? handleClick : undefined}
      />
      <Chip
        id={'filter-Ref'}
        color={selected.includes('filter-Ref') ? 'primary' : 'default'}
        label="Referensregel"
        size="small"
        onClick={!disabled ? handleClick : undefined}
      />
    </div>
  );
}
