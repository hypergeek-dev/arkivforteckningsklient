import { Box, Button, Container, Grid2 } from '@mui/material';
import {
  OverviewFilter,
  SortOrder,
  actions,
} from 'Store/ducks/eventlogg/reducer';
import {
  selectFilterListwith,
  selectOverViewSortType,
  selectOverviewFilter,
  selectSearchDate,
  selectSortOrder,
} from 'Store/ducks/eventlogg/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';
import ResultList from './components/ResultList';
import StatisticCard from './components/eventOverview/StatisticCard';
import TimeSelect from './components/eventOverview/TimeSelect';
import SortSelect from 'Scenarios/components/SortSelect';
import { selectedValues } from './constants';
import styles from './EventOverview.module.css';

export default function EventOverview() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectOverviewFilter);
  const selectedSortType = useAppSelector(selectOverViewSortType);
  const selectedSortOrder = useAppSelector(selectSortOrder);
  const date = useAppSelector(selectSearchDate);

  function setFilter(f: OverviewFilter) {
    dispatch(actions.setOverviewFilter(f));
  }
  const data = useAppSelector((state) =>
    selectFilterListwith(state, selectedSortType)
  );

  return (
    <Grid2 container rowGap={2} columnGap={2} sx={{ width: '100%' }}>
      <Grid2
        key={`date-${date.from}-${date.to}`}
        size={{ xs: 12 }}
        className={styles.item}
      >
        {date.from} - {date.to}
      </Grid2>
      <Grid2 size={{ xs: 12 }} className={styles.item}>
        <FilterButton
          currentValue={filter}
          value="statusMovement"
          text="Statusförflyttningar"
          setFilter={setFilter}
        />
        <FilterButton
          currentValue={filter}
          value="create"
          text="Skapat"
          setFilter={setFilter}
        />
        <FilterButton
          currentValue={filter}
          value="copy"
          text="Kopierat"
          setFilter={setFilter}
        />
        <FilterButton
          currentValue={filter}
          value="delete"
          text="Raderat"
          setFilter={setFilter}
        />
        <FilterButton
          currentValue={filter}
          value="update"
          text="Förändringar"
          setFilter={setFilter}
        />
        <FilterButton
          currentValue={filter}
          value="comment"
          text="Kommentarer"
          setFilter={setFilter}
        />
        <TimeSelect />
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Grid2
          container
          columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
          className={styles.item}
          sx={{ marginTop: '40px' }}
          gap={2}
        >
          <StatisticCard
            label={
              filter === 'statusMovement' ? 'Klarmarkerat' : 'Volymer'
            }
            onClick={(n) => dispatch(actions.showFiltredList(n))}
            sortType={filter === 'statusMovement' ? 'klar' : 'documentnode'}
          />
          <StatisticCard
            label={filter === 'statusMovement' ? 'Godkänt' : 'Underserier'}
            onClick={(n) => dispatch(actions.showFiltredList(n))}
            sortType={filter === 'statusMovement' ? 'godkand' : 'issuenode'}
          />
          <StatisticCard
            label={
              filter === 'statusMovement' ? 'Tillbaka till utkast' : 'Processer'
            }
            onClick={(n) => dispatch(actions.showFiltredList(n))}
            sortType={filter === 'statusMovement' ? 'utkast' : 'processnode'}
          />
          <StatisticCard
            label={
              filter === 'statusMovement' ? 'Fastställt' : 'Arkiv'
            }
            onClick={(n) => dispatch(actions.showFiltredList(n))}
            sortType={filter === 'statusMovement' ? 'faststalld' : 'pgnode'}
          />
        </Grid2>
      </Grid2>
      {data.length !== 0 && (
        <Grid2
          size={{ xs: 12 }}
          sx={{ bgcolor: 'background.paper', marginTop: '32px' }}
        >
          <Container>
            <Box sx={{ paddingTop: 4, maxWidth: '1000px' }}>
              <Grid2 columnGap={4} container>
                <Grid2 size={{ xs: 7 }}>
                  <ResultList data={data} />
                </Grid2>
                <Grid2
                  size={{ xs: 3 }}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
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
          </Container>
        </Grid2>
      )}
    </Grid2>
  );
}

interface FilterButtonProps {
  value: OverviewFilter;
  currentValue: OverviewFilter;
  text: string;
  setFilter: (name: OverviewFilter) => void;
}

function FilterButton({
  value,
  currentValue,
  text,
  setFilter,
}: Readonly<FilterButtonProps>) {
  return (
    <Button
      size="small"
      sx={(theme) => ({
        height: '30px',
        backgroundColor:
          value === currentValue
            ? theme.palette.primary.main
            : theme.palette.background.paper,
        color:
          value === currentValue
            ? theme.palette.background.paper
            : theme.palette.text.primary,
        marginRight: 2,
      })}
      onClick={() => setFilter(value)}
      variant="contained"
    >
      {text}
    </Button>
  );
}
