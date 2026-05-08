import { Box } from '@mui/material';
import { actions, selectors } from 'Store/ducks/IHPToolStructure';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  actions as statusActions,
  selectors as statusSelectors,
} from 'Store/ducks/batchStatus';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';
import SpeedTree from '../SpeedTree/SpeedTree';

const TreeView = () => {
  const treeData = useAppSelector(selectors.selectSearchNodes);
  const expanded = useAppSelector(selectors.selectExpanded);
  const ksid = useAppSelector(selectors.selectedKsID);
  const status = useAppSelector(selectors.selectStatusFilter);
  const disableExpand = useAppSelector(selectors.disableExpand);
  const selectStatusIDS = useAppSelector(statusSelectors.selectStatusIDS);
  const dispatch = useAppDispatch();

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ paddingLeft: { xl: '10%', xs: '0' } }}>
        <Box sx={{ width: { xl: '90%', xs: '100%' } }}>
          <div style={{ height: '70vh' }}>
            {treeData.length > 0 && (
              <SpeedTree
                expanded={expanded}
                data={treeData}
                setExpanded={(ids) => dispatch(actions.setExpanded(ids))}
                ksId={'' + ksid}
                onSelectCheckbox={(n) => dispatch(statusActions.setStatusID(n))}
                displayCheckbox={status !== 'Alla'}
                selectStatusIDS={selectStatusIDS}
                disableExpand={disableExpand}
              />
            )}
          </div>
        </Box>
      </Box>
    </DndProvider>
  );
};
export default TreeView;
