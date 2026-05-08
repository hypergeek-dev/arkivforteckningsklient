import React from 'react';
import {
  createHashRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';

import { createRoot } from 'react-dom/client';

import KsReport from 'Scenarios/reportview/ksreport';

import { OpenAPI } from 'Models/core/OpenAPI';
import moment from 'moment';
import { Provider } from 'react-redux';
import CreateElement from 'Scenarios/elements/CreateElement';
import Elements from 'Scenarios/elements/Elements';
import EventLogg from 'Scenarios/eventlogg/EventLogg';
import CardView from 'Scenarios/ihpToolStructure/components/cardview/CardView';
import TreeView from 'Scenarios/ihpToolStructure/components/treeview/TreeView';
import IhpTool from 'Scenarios/ihpToolStructure/Ihptoolstructure';
import CreateRegulation from 'Scenarios/regulation/CreateRegulation';
import IndexRegulation from 'Scenarios/regulation/IndexRegulation';
import ListRegulation from 'Scenarios/regulation/ListRegulation';
import WelcomePage from 'Scenarios/start/WelcomePage';
import RestHeaders from 'Services/RestHeaders';
import { actions } from 'Store/ducks/data';
import { actions as elementActions } from 'Store/ducks/elements';
import { actions as eventActions } from 'Store/ducks/eventlogg';
import { actions as ihpActions } from 'Store/ducks/IHPToolStructure';
import { actions as regulationActions } from 'Store/ducks/regulation';
import { useAppDispatch } from 'Store/hooks';
import App from './App/App';
import './index.css';
import { store } from './store/store';
const port = window.location.port;

if (port === '3000') {
  OpenAPI.BASE = 'http://localhost:3000';
} else {
  OpenAPI.BASE = '/ihpappbackend';
}
OpenAPI.HEADERS = RestHeaders.get;

const ErrorElement = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginInline: 'auto', width: '600px' }}>
      <h1>Ingen vy för den urlen</h1>
      <p>
        <button onClick={() => navigate(-1)}>Gå tillbaka</button>
      </p>
    </div>
  );
};
function Index() {
  const dispatch = useAppDispatch();

  const router = createHashRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorElement />,
      children: [
        { path: 'about/', element: <WelcomePage /> },
        {
          path: '/',
          element: <IhpTool />,
          children: [
            {
              path: 'card',
              element: <CardView />,
            },
            {
              path: 'tree',
              loader: async () => {
                try {
                  dispatch(ihpActions.setViewTab('tree'));
                } catch (e) {
                  console.error(e);
                }
                return 'done';
              },
              element: <TreeView />,
            },
            {
              path: '/',
              element: <TreeView />,
            },
          ],
        },
        {
          path: '/indexregulation',
          loader: async () => {
            try {
              dispatch(regulationActions.fetchRuleList());
            } catch (e) {
              console.error(e);
            }
            return 'done';
          },
          element: <IndexRegulation />,
          children: [
            {
              path: 'list',
              element: <ListRegulation />,
            },
            {
              path: 'create',
              element: <CreateRegulation />,
            },
            {
              path: 'view/:id',
              element: <CreateRegulation />,
            },
          ],
        },
        {
          path: '/rapport',
          loader: async () => {
            try {
              dispatch(actions.loadEstablished());
            } catch (e) {
              console.error(e);
            }
            return 'done';
          },
          element: <KsReport />,
        },
        {
          path: '/eventlogg',
          loader: async () => {
            try {
              const searchDate = {
                from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD'),
              };
              dispatch(eventActions.fetchEventsBetween(searchDate));
            } catch (e) {
              console.log(e);
            }
            return 'done';
          },
          element: <EventLogg />,
        },
        {
          path: '/elements',
          loader: async () => {
            try {
              dispatch(elementActions.fetchElements());
            } catch (e) {
              console.log(e);
            }
            return 'done';
          },
          element: <Elements />,
        },
        { path: '/createelement', element: <CreateElement /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <Index />
  </Provider>
);
