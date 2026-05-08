import {
  Box,
  Button,
  Container,
  Grid2,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import BottomBar from 'Scenarios/components/BottomBar';
import DateRange from 'Scenarios/components/DateRange';
import Filter, { FilterValue } from 'Scenarios/components/Filter';
import SearchInput from 'Scenarios/components/SearchInput';
import SortSelect from 'Scenarios/components/SortSelect';
import { PageHeading } from 'Scenarios/components/Typos';
import Wrapper from 'Scenarios/components/Wrapper';
import { actions } from 'Store/ducks/elements';
import {
  ElementFilter,
  SearchDate,
  SortOrder,
} from 'Store/ducks/elements/reducer';
import {
  selectFilterList,
  selectSearchDate,
  selectSearchFilter,
  selectSearchValue,
  selectSortOrder,
} from 'Store/ducks/elements/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';
import Dialogs from './Dialogs';
import ResultList from './components/ResultList';
import { selectedValues } from './constants';

const filterValues: FilterValue<ElementFilter>[] = [
  { value: 'issues', label: 'Ärendetyper' },
  { value: 'documents', label: 'Handlingstyper' },
  { value: 'elements', label: 'Eget element' },
  { value: 'documenttypes', label: 'Dokumenttyp' },
  { value: 'draft', label: 'Utkast' },
  { value: 'established', label: 'Fastställd' },
];

export default function Elements() {
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const date = useAppSelector(selectSearchDate);
  const data = useAppSelector(selectFilterList);
  const value = useAppSelector(selectSearchValue);
  const dispatch = useAppDispatch();
  const selectedFilter = useAppSelector(selectSearchFilter);
  const sortOrder = useAppSelector(selectSortOrder);

  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const setDate = (v: SearchDate) => {
    dispatch(actions.setSearchDate(v));
  };

  const setValue = (v: string) => {
    dispatch(actions.setSearchValue(v));
  };

  const handleChipSelet = (name: ElementFilter) => {
    if (!selectedFilter.includes(name)) {
      dispatch(actions.setSearchFilter([...selectedFilter, name]));
    } else {
      dispatch(
        actions.setSearchFilter(selectedFilter.filter((n) => n !== name))
      );
    }
  };

  return (
    <Wrapper
      style={{
        padding: 0,
        marginTop: 0,
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
        minHeight: '100vh',
        paddingBottom: '6rem',
        color: theme.palette.text.primary,
      }}
    >
      <div
        style={{
          paddingTop: '90px',
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : 'rgb(33, 33, 33)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container>
          <PageHeading>Egna element</PageHeading>
        </Container>
      </div>
      <div
        style={{
          marginLeft: onlySmallScreen ? 0 : '20%',
          paddingTop: '2rem',
          maxWidth: '1000px',
        }}
      >
        <Grid2
          spacing={4}
          container
          flexDirection={onlySmallScreen ? 'column-reverse' : 'row'}
        >
          <Grid2
            size={{ xs: 12 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <SearchInput
              filterOpen={filterOpen}
              toggleFilter={toggleFilter}
              value={value}
              setValue={setValue}
              noToggle
            />
          </Grid2>
          {filterOpen && (
            <>
              <Grid2 size={{ xs: 4 }}>
                <Box
                  sx={(theme) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    height: '220px',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      position: 'absolute',
                      top: '-14px',
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? '#F2F2F2'
                          : theme.palette.background.paper,
                      padding: '0 0.5rem',
                    })}
                  >
                    <Typography variant="caption">Val</Typography>
                  </Box>
                  <Filter
                    filterValues={filterValues}
                    handleChipSelet={handleChipSelet}
                    selectedFilter={selectedFilter}
                    style={{ margin: 0 }}
                    columns={2}
                  />
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 8 }}>
                <Box
                  sx={(theme) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    height: '220px',

                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      position: 'absolute',
                      top: '-14px',
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? '#F2F2F2'
                          : theme.palette.background.paper,
                      padding: '0 0.5rem',
                    })}
                  >
                    <Typography variant="caption">Giltighetsdatum</Typography>
                  </Box>
                  <DateRange date={date} setDate={setDate} />
                </Box>
              </Grid2>
            </>
          )}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <ResultList data={data} />
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: onlySmallScreen ? 'center' : 'flex-end',
            }}
          >
            <SortSelect
              selectedValues={selectedValues}
              selected={sortOrder}
              setSortOrder={(v) =>
                dispatch(actions.setSortOrder(v as SortOrder))
              }
            />
          </Grid2>
        </Grid2>
      </div>
      <BottomBar>
        <Button
          onClick={() => {
            dispatch(actions.setOpenEditDialog(true));
          }}
          color="primary"
          variant="contained"
          aria-label="Skapa"
        >
          + SKAPA NYTT
        </Button>
      </BottomBar>
      <Dialogs />
    </Wrapper>
  );
}
