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
import Filter from 'Scenarios/components/Filter';
import SortSelect from 'Scenarios/components/SortSelect';
import StandardDialog from 'Scenarios/components/StandardDialog';
import { PageHeading } from 'Scenarios/components/Typos';
import Wrapper from 'Scenarios/components/Wrapper';
import ConfirmDialog from 'Scenarios/components/dialogs/ConfirmDialog';
import { actions, selectors } from 'Store/ducks/regulation';
import {
  ConfirmOptions,
  SearchRegulationFilter,
  SortOrder,
} from 'Store/ducks/regulation/reducer';
import {
  selectConfirm,
  selectFilterSortedList,
  selectOpenDialog,
  selectSavedStatus,
} from 'Store/ducks/regulation/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import CreateRegulation from './CreateRegulation';
import ResultList from './components/ResultList';
import { filterOptions } from './constants';

const selectedValues = [
  { value: 'LATEST', label: 'Senaste' },
  { value: 'OLDEST', label: 'Äldst' },
];

const IndexRegulation = () => {
  const openDialog = useAppSelector(selectOpenDialog);
  const selectedRule = useAppSelector(selectors.selectSavedSelectedRule);
  const sortOrder = useAppSelector(selectors.selectSortOrder);
  const ruleComplete = useAppSelector(selectors.selectRuleComplete);
  const savedStatus = useAppSelector(selectSavedStatus);
  const filter = useAppSelector(selectors.selectSearchRegulationFilter);
  const openConfirm = useAppSelector(selectConfirm);
  const data = useAppSelector(selectFilterSortedList);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const setOpenConfirm = (option: ConfirmOptions) =>
    dispatch(actions.setConfirm(option));

  const handleChipSelet = (name: SearchRegulationFilter) => {
    if (!filter.includes(name)) {
      dispatch(actions.setSearchFilter([...filter, name]));
    } else {
      dispatch(actions.setSearchFilter(filter.filter((n) => n !== name)));
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
          <PageHeading>Regelbanken</PageHeading>
        </Container>
      </div>
      <div
        style={{
          marginLeft: onlySmallScreen ? 0 : '20%',

          maxWidth: '1100px',
        }}
      >
        <Grid2
          spacing={4}
          container
          flexDirection={onlySmallScreen ? 'column-reverse' : 'row'}
        >
          <Grid2 size={{ xs: 12 }} pb={'20px'}>
            <Filter
              filterValues={filterOptions}
              handleChipSelet={handleChipSelet}
              selectedFilter={filter}
            />
          </Grid2>
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
            {(filter.includes('FIVE_+') ||
              filter.includes('THREE_FIVE') ||
              filter.includes('ZERO_THREE')) &&
              !filter.includes('DEFAULT_RULE') &&
              !filter.includes('COMMENT') && (
                <Box sx={{ paddingTop: '1rem' }}>
                  <Typography variant="body1">
                    Välj filter Gallringsregler
                  </Typography>
                </Box>
              )}
          </Grid2>
        </Grid2>
      </div>
      <BottomBar>
        <Button
          onClick={() => {
            dispatch(actions.openDialog(true));
          }}
          color="primary"
          variant="contained"
          aria-label="Skapa"
        >
          + SKAPA GALLRINGSREGEL
        </Button>
      </BottomBar>
      <StandardDialog
        fullScreen
        toolBarContent={
          <div>
            {ruleComplete && (
              <Button
                sx={{ marginRight: '1rem' }}
                onClick={() => setOpenConfirm('ADD_FASTSTALL')}
                color="primary"
                variant="contained"
                aria-label="Fastställ"
                disabled={savedStatus === 'faststalld'}
              >
                Fastställ
              </Button>
            )}
            {savedStatus === 'faststalld' && (
              <Button
                sx={{ marginRight: '1rem' }}
                onClick={() => {
                  dispatch(actions.saveRule('update'));
                  dispatch(actions.openDialog(false));
                }}
                color="primary"
                variant="contained"
                aria-label="Fastställ"
              >
                Spara fastställd
              </Button>
            )}
            <Button
              disabled={!ruleComplete || savedStatus === 'faststalld'}
              onClick={() => {
                dispatch(actions.saveRule(selectedRule ? 'update' : 'add'));
                dispatch(actions.openDialog(false));
              }}
              color="primary"
              variant="outlined"
              aria-label="Spara utkast"
            >
              Spara utkast
            </Button>
          </div>
        }
        handleClose={() => {
          dispatch(actions.openDialog(false));
        }}
        open={openDialog}
      >
        <CreateRegulation />
      </StandardDialog>
      <ConfirmDialog
        open={openConfirm === 'DELETE'}
        dialogContent="Vill ni radera regel?"
        handleClose={() => setOpenConfirm('CLOSE')}
        title="Radera regel"
        confirm={() => {
          if (selectedRule?.id) {
            dispatch(actions.deleteRule(selectedRule.id));
          }
          setOpenConfirm('CLOSE');
        }}
      />
      <ConfirmDialog
        title="Fastställ regel"
        dialogContent="Vill du faställa regel? Den kan inte ändras eller raderas efteråt."
        open={openConfirm === 'FASTSTALL'}
        handleClose={() => setOpenConfirm('CLOSE')}
        confirm={() => {
          if (selectedRule?.id) {
            dispatch(actions.establishRule(selectedRule.id));
          }
          setOpenConfirm('CLOSE');
        }}
      />
      <ConfirmDialog
        title="Fastställ regel"
        dialogContent="Vill du faställa regel? Den kan inte ändras eller raderas efteråt."
        open={openConfirm === 'ADD_FASTSTALL'}
        handleClose={() => setOpenConfirm('CLOSE')}
        confirm={() => {
          if (selectedRule?.id) {
            dispatch(actions.establishRule(selectedRule.id));
            dispatch(actions.openDialog(false));
          } else {
            dispatch(actions.saveRule('add_faststall'));
            dispatch(actions.openDialog(false));
          }
          setOpenConfirm('CLOSE');
        }}
      />
    </Wrapper>
  );
};

export default IndexRegulation;
