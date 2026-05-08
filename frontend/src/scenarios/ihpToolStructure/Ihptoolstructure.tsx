import { AccountTreeOutlined, ImageOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  actions as ihpActions,
  selectors as ihpSelectors,
} from 'Store/ducks/IHPToolStructure';
import { ViewTabValues } from 'Store/ducks/IHPToolStructure/reducer';
import { selectThemeSelected } from 'Store/ducks/user/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { useFilterUrl } from './components/hooks';

// actions && selectors
import {
  actions as batchActions,
  selectors as batchSelectors,
} from 'Store/ducks/batchStatus';

// components
import { NodeCommentControllerService, NodeTypeCommentDto } from 'Models/index';
import BottomBar from 'Scenarios/components/BottomBar';
import CommentDrawer from 'Scenarios/nodes/editNode/CommentDrawer';
import RestHeaders from 'Services/RestHeaders';
import { UserSelectors } from 'Store/index';
import StatusModal from './components/StatusModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}
function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          backgroundColor:
            theme.palette.mode === 'light'
              ? '#FFFFFF'
              : theme.palette.background.paper,
          padding: '1rem',
          paddingRight: '5rem',
          minHeight: 'calc(100vh - 255px)',
          paddingBottom: '4rem',
        })}
      >
        {children}
      </Box>
    </div>
  );
}

const sortComments = (a: NodeTypeCommentDto, b: NodeTypeCommentDto): number => {
  if (a.createdAt && b.createdAt) {
    return a.createdAt.localeCompare(b.createdAt);
  }
  return -1;
};
const Ihptoolstructure = () => {
  const themeSelected = useAppSelector(selectThemeSelected);
  const selectionLink = useAppSelector(ihpSelectors.selectSelectionLink);
  const userName = useAppSelector(UserSelectors.selectUserName);
  const auth = useAppSelector(UserSelectors.selectAuthUser);
  const statusSelected = useAppSelector(ihpSelectors.selectStatusFilter);
  const theme = useTheme();
  const selectedTab = useAppSelector(ihpSelectors.selectViewTab);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ksid, search, filter, status } = useParams();

  const statusIDS = useAppSelector(batchSelectors.selectStatusIDS);
  const statusErrorIDS = useAppSelector(batchSelectors.selectStatusErrorIDS);
  const openStatusDialog = useAppSelector(
    batchSelectors.selectOpenStatusDialog
  );
  const allChecked = useAppSelector(batchSelectors.selectAllChecked);
  const [comments, setComments] = useState<NodeTypeCommentDto[]>([]);
  const [comment, setComment] = useState<string>('');

  useFilterUrl(ksid, search, filter, status);

  useEffect(() => {
    if (ksid) {
      getComment(ksid);
    }
  }, [ksid]);

  React.useEffect(() => {
    if (selectionLink) navigate(selectedTab + '/' + selectionLink);
  }, [selectionLink]);

  async function getComment(id: string) {
    const params = { ...RestHeaders.get, auth: userName };
    const c = await NodeCommentControllerService.getComments({
      ...params,
      nodeId: parseInt(id, 10),
    });

    setComments([...c].sort(sortComments));
  }

  async function sendComment(c: string) {
    if (ksid) {
      const params = { ...RestHeaders.get, auth: userName };
      const nodeComment: NodeTypeCommentDto = {
        comment: c,
        nodeId: parseInt(ksid, 10),
      };
      await NodeCommentControllerService.add2({
        ...params,
        requestBody: nodeComment,
      });
      setComment('');
      await getComment(ksid);
    }
  }

  return (
    <>
      <CssBaseline />
      <div
        style={{
          marginTop: '0',
          paddingTop: '65px',
          backgroundColor:
            themeSelected === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor:
              themeSelected === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            borderBottom: `1px solid ${
              themeSelected === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[100]
            }`,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(
              event: React.SyntheticEvent,
              newValue: ViewTabValues
            ) => {
              dispatch(ihpActions.setViewTab(newValue));
              navigate(newValue + '/' + selectionLink);
            }}
            aria-label="Byt mellan strukturenhet och kortvy"
          >
            <Tab
              aria-label="Strukturvy"
              title="Strukturvy"
              icon={<AccountTreeOutlined height={18} />}
              value={'tree'}
            />
            <Tab
              aria-label="Kortvy"
              title="Kortvy"
              icon={<ImageOutlined sx={{ height: '18px' }} />}
              value={'card'}
            />
          </Tabs>
        </div>
        <div
          style={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              themeSelected === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
          }}
        >
          <SearchBar />
          {auth && (
            <CommentDrawer
              comment={comment}
              comments={comments}
              send={sendComment}
              setComment={setComment}
            />
          )}
        </div>
        <TabPanel value="card" index={selectedTab}>
          <Outlet />
        </TabPanel>
        <TabPanel value="tree" index={selectedTab}>
          <Outlet />
        </TabPanel>
      </div>

      {statusSelected !== 'Alla' && (
        <>
          <BottomBar>
            <Checkbox
              aria-label="Välj alla noder om checkbox är kryssad eller rensa om checkbox ej är kryssad."
              checked={allChecked}
              onChange={() => dispatch(batchActions.setAllChecked(!allChecked))}
            />
            <Button
              disabled={statusIDS.length === 0}
              onClick={() => dispatch(batchActions.setOpenStatusDialog(true))}
              variant="contained"
            >
              Sätt status
            </Button>
          </BottomBar>
          <StatusModal
            key={`statusModal-${statusIDS.length}`}
            warning={statusErrorIDS.length !== 0}
            selectedNumber={statusIDS.length}
            open={openStatusDialog}
            handleClose={() =>
              dispatch(batchActions.setOpenStatusDialog(false))
            }
            setStatus={(status, comment) => {
              const start = performance.now();
              dispatch(
                batchActions.batchUpdateStatus({
                  ids: statusIDS,
                  status,
                  comment,
                })
              );
              const stop = performance.now();
              console.log('Time: ', stop - start);
            }}
            currentStatus={statusSelected}
          />
        </>
      )}
    </>
  );
};

export default Ihptoolstructure;
