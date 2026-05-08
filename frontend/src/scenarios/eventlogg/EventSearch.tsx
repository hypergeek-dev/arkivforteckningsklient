import { Box, Container, Grid2, useMediaQuery, useTheme } from '@mui/material';
import { EventLogDto } from 'Models/index';
import { EventLoggAction, NodeName } from 'Models/typed';
import DateForm from 'Scenarios/components/DateForm';
import SortSelect from 'Scenarios/components/SortSelect';
import { SearchDate, SortOrder, actions } from 'Store/ducks/eventlogg/reducer';
import {
  selectSearchDate,
  selectSearchFilter,
  selectSearchValue,
  selectSortOrder,
  selectSortedList,
} from 'Store/ducks/eventlogg/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import moment from 'moment';
import * as React from 'react';
import Filter from '../components/Filter';
import SearchInput from '../components/SearchInput';
import ResultList from './components/ResultList';
import { filterValues, selectedValues } from './constants';

export default function EventSearch() {
  const data: EventLogDto[] = useAppSelector(selectSortedList);
  const dispatch = useAppDispatch();
  const date = useAppSelector(selectSearchDate);
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const value = useAppSelector(selectSearchValue);
  const selectedSortOrder = useAppSelector(selectSortOrder);
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const selectedFilter = useAppSelector(selectSearchFilter);

  const handleChipSelet = (name: EventLoggAction | NodeName | 'username') => {
    if (!selectedFilter.includes(name)) {
      dispatch(actions.setSearchFilter([...selectedFilter, name]));
    } else {
      dispatch(
        actions.setSearchFilter(selectedFilter.filter((n) => n !== name))
      );
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const setDate = (v: SearchDate) => {
    dispatch(actions.setSearchDate(v));
  };

  const setValue = (v: string) => {
    dispatch(actions.setSearchValue(v));
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Grid2 container spacing={2} sx={{ width: '100%' }}>
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
          <Grid2 size={{ xs: 12 }}>
            <Grid2 gap={2} container justifyContent={'center'}>
              <Grid2>
                <DateForm
                  date={date.from}
                  onChangeHandler={(v) => {
                    const from = moment(v).format('YYYY-MM-DD');
                    setDate({ ...date, from });
                  }}
                  label="Från"
                  id={'from'}
                />
              </Grid2>
              <Grid2>
                <DateForm
                  date={date.to}
                  onChangeHandler={(v) => {
                    const to = moment(v).format('YYYY-MM-DD');
                    setDate({ ...date, to });
                  }}
                  label="Till"
                  id={'to'}
                />
              </Grid2>
            </Grid2>
            <Filter
              filterValues={filterValues}
              handleChipSelet={handleChipSelet}
              selectedFilter={selectedFilter}
            />
          </Grid2>
        )}
      </Grid2>
      {data.length !== 0 && (
        <Box
          sx={{
            bgcolor: 'background.paper',
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Grid2
            spacing={4}
            container
            flexDirection={onlySmallScreen ? 'column-reverse' : 'row'}
            sx={{ width: '100%' }}
          >
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
                selected={selectedSortOrder}
                selectedValues={selectedValues}
                setSortOrder={(v) =>
                  dispatch(actions.setSortOrder(v as SortOrder))
                }
              />
            </Grid2>
          </Grid2>
        </Box>
      )}
    </Container>
  );
}
