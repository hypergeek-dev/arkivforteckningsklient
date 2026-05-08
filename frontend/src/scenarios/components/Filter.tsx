import { Container, Grid2 } from '@mui/material';
import ChipSelect from 'Scenarios/components/ChipSelect';
import { MD5 } from 'object-hash';
import * as React from 'react';

export interface FilterValue<Type> {
  value: Type;
  label: string;
  style?: React.CSSProperties;
}

const Filter = <Type,>({
  filterValues,
  handleChipSelet,
  selectedFilter,
  style,
  columns,
}: {
  selectedFilter: Type[];
  handleChipSelet: (v: Type) => void;
  filterValues: FilterValue<Type>[];
  style?: React.CSSProperties;
  columns?: number;
}) => {
  const itemSpan = columns ? 1 : undefined;
  return (
    <Container
      sx={{
        marginTop: 2,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Grid2
        spacing={2}
        columns={columns}
        container
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {filterValues.map((f) => (
          <Grid2 size={{ xs: itemSpan }} key={`filteroption-${MD5(f)}`}>
            <ChipSelect
              handleChipSelect={() => handleChipSelet(f.value)}
              active={selectedFilter.includes(f.value)}
              label={f.label}
              variant="outlined"
            />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};
export default Filter;
