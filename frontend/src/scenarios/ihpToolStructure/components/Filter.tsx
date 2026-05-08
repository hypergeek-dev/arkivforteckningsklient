import { Box, Grid2, Typography } from '@mui/material';
import { DOCUMENT_TYPE } from 'Models/typed';
import ChipSelect from 'Scenarios/components/ChipSelect';
import { SearchFilter, actions } from 'Store/ducks/IHPToolStructure/reducer';
import { selectNodeNameFilter } from 'Store/ducks/IHPToolStructure/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';

const Filter: React.FC = () => {
  const nodeNames = useAppSelector(selectNodeNameFilter);

  const dispatch = useAppDispatch();

  const handleChipSelet = (name: SearchFilter) => {
    if (!nodeNames.includes(name)) {
      dispatch(actions.setNodeNamefilter([...nodeNames, name]));
    } else {
      dispatch(actions.setNodeNamefilter(nodeNames.filter((n) => n !== name)));
    }
  };

  return (
    <Box>
      <Typography
        sx={(theme) => ({
          color:
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.6)'
              : theme.palette.text.primary,
          marginBottom: { md: '19px', xs: 0 },
        })}
        variant="body1"
      >
        <b>Filtrera</b>
      </Typography>
      <Grid2
        spacing={1}
        container
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet('oanode')}
            label="Verksamhetsområde"
            active={nodeNames.includes('oanode')}
          />
        </Grid2>
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet('pgnode')}
            active={nodeNames.includes('pgnode')}
            label="Processgrupp"
          />
        </Grid2>
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet('processnode')}
            active={nodeNames.includes('processnode')}
            label="Process"
          />
        </Grid2>
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet('issuenode')}
            active={nodeNames.includes('issuenode')}
            label="Ärendetyp"
          />
        </Grid2>
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet('documentnode')}
            active={nodeNames.includes('documentnode')}
            label="Handlingstyp"
          />
        </Grid2>
        <Grid2>
          <ChipSelect
            handleChipSelect={() => handleChipSelet(DOCUMENT_TYPE)}
            active={nodeNames.includes(DOCUMENT_TYPE)}
            label="Dokumenttyp"
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};
export default Filter;
