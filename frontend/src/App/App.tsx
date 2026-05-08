import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import StandardDialog from 'Scenarios/components/StandardDialog';
import CopyDialog from 'Scenarios/components/menu/CopyDialog';
import CreateNode from 'Scenarios/nodes/editNode/CreateNode';
import EditNode from 'Scenarios/nodes/editNode/EditNode';
import IHPReport from 'Scenarios/reportview/ihpreport';
import { actions } from 'Store/ducks/app/reducer';
import {
  selectIHPReport,
  selectLoading,
  selectResponse,
} from 'Store/ducks/app/selectors';
import { selectThemeSelected } from 'Store/ducks/user/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import moment from 'moment';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { darkTheme, lightTheme } from '../theme';
import GlobalAppBar from './components/GlobalAppBar';
import Loader from './components/Loader';
import Notify from './components/Notify';

moment.locale('sv');
moment.updateLocale('sv', {
  calendar: {
    lastDay: '[igår]',
    sameDay: '[idag]',
    nextDay: '[imorgon]',
    lastWeek: '[förra] dddd',
    nextWeek: '[nästa] dddd',
    sameElse: 'L',
  },
});

const App: React.FC = () => {
  const response = useAppSelector(selectResponse);
  const themeSelected = useAppSelector(selectThemeSelected);
  const dispatch = useAppDispatch();
  const ihpReport = useAppSelector(selectIHPReport);

  const open = useAppSelector(selectLoading);

  const handleClose = () => {
    dispatch(actions.closeIHPReport());
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeSelected === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <GlobalAppBar>
          <>
            <EditNode />
            <CreateNode />
            <CopyDialog />

            <StandardDialog
              fullScreen
              open={Boolean(ihpReport)}
              handleClose={handleClose}
            >
              <IHPReport
                fromId={ihpReport?.nodeId ?? ''}
                ksId={ihpReport?.id ?? ''}
              />
            </StandardDialog>

            <Notify
              key={response.key}
              message={response.message}
              type={response.type}
            />
            {open && <Loader open={true} />}
            <Outlet />
          </>
        </GlobalAppBar>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
