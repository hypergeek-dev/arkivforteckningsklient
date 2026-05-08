import {
  Box,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import SearchInput from 'Scenarios/components/SearchInput';
import {
  selectors as IHPToolSelectors,
  actions,
} from 'Store/ducks/IHPToolStructure';
import { actions as appActions } from 'Store/ducks/app';
import { selectors as dataSelectors } from 'Store/ducks/data';
import { selectors as userSelectors } from 'Store/ducks/user';
import { useAppDispatch, useAppSelector } from 'Store/hooks';

import { Add } from '@mui/icons-material';
import IHPCardMenu from 'Scenarios/components/menu/IHPCardMenu';
import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import StatusFilter from './StatusFilter';
import { useDebounce } from './hooks';

const SearchBar = () => {
  const auth = useAppSelector(userSelectors.selectAuthUser);
  const selectKS = useAppSelector(IHPToolSelectors.selectedKsID);
  const selectKSNode = useAppSelector(dataSelectors.selectChosenKS);
  const searchValue = useAppSelector(IHPToolSelectors.selectSearchText);
  const [value, setValue] = useState<string>(searchValue ?? '');
  const debouncedValue = useDebounce<string | undefined>(value, 500);
  const dispatch = useAppDispatch();
  const allKs = useAppSelector(dataSelectors.selectAllKs);

  const handleChange = (v: string) => {
    setValue(v);
  };
  useEffect(() => {
    dispatch(actions.setSearchText(value));
  }, [debouncedValue]);

  return (
    <Grid2
      container
      alignItems={'center'}
      sx={{
        padding: { md: '0 4rem', xs: '1rem' },
        display: { lg: 'flex' },
        position: 'relative',
      }}
    >
      <Grid2 sx={{ minHeight: { xl: '100px', xs: 'auto' } }}>
        <FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {auth && (
              <>
                <IHPCardMenu
                  ksId={`${selectKS}`}
                  id={`${selectKS}`}
                  nodeName={'csnode'}
                  status={selectKSNode?.status ?? 'utkast'}
                />
                <IconButton
                  onClick={() =>
                    dispatch(
                      appActions.createEditDialog({
                        id: 'csnode',
                        nodeName: 'csnode',
                      })
                    )
                  }
                >
                  <Add fontSize="small" />
                </IconButton>
              </>
            )}
            <InputLabel htmlFor="Klassificeringsstruktur-id" id="select-for-ks">
              <b>Klassificeringsstruktur</b>
            </InputLabel>
          </Box>

          <Select
            inputProps={{ id: 'Klassificeringsstruktur-id' }}
            sx={(theme) => ({
              width: '100%',
              maxWidth: '240px',
              backgroundColor: theme.palette.background.paper,
            })}
            labelId="select-for-ks"
            value={`${selectKS}`}
            onChange={(event: SelectChangeEvent<string>) => {
              const {
                target: { value },
              } = event;
              dispatch(actions.fetchNewSnapshot(parseInt(value)));
            }}
            input={<OutlinedInput label="Name" />}
          >
            {allKs.map((ks) => (
              <MenuItem aria-label={``} key={ks.id} value={ks.id}>
                {ks.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid2>
      <Grid2
        size={{ xs: 12, md: 8 }}
        sx={{
          display: {
            xs: 'block',
            md: 'flex',
            justifyContent: 'center',
          },
          minHeight: { xl: '100px', xs: 'auto' },
        }}
      >
        <SearchInput
          noToggle
          sx={{
            marginTop: { md: '48px', xs: '6px' },
            paddingLeft: { md: '1rem' },
            width: '350px',
          }}
          hideFilter
          setValue={(v) => handleChange(v)}
          value={value}
          placeholder="Ex sök 1.1.1"
        />

        <Box
          sx={{
            overflowX: 'auto',
            width: '100%',
            paddingLeft: { md: '1rem', xs: 0 },
            marginTop: '8px',
          }}
        >
          <Filter />
        </Box>
      </Grid2>
      <Grid2
        sx={{
          display: 'flex',
          justifyContent: { lg: 'flex-end', xs: 'flex-start' },
          minHeight: { xl: '100px', xs: 'auto' },
          marginTop: { md: '17px', xs: 0 },
        }}
      >
        <StatusFilter />
      </Grid2>
    </Grid2>
  );
};
export default React.memo(SearchBar);
