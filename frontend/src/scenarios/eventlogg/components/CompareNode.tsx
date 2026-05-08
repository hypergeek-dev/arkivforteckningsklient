import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';

import EditDialog from 'Scenarios/components/dialogs/EditDialog';
import CompareView from 'Scenarios/components/compareview/CompareView';
import { selectedCompare } from 'Store/ducks/eventlogg/selectors';
import { actions } from 'Store/ducks/eventlogg';

const CompareNode: React.FC = () => {
  const compare = useAppSelector(selectedCompare);
  const dispatch = useAppDispatch();

  if (compare.latestUpdatedNode && compare.selectedHistory) {
    return (
      <EditDialog
        open={compare.open}
        handleClose={() => dispatch(actions.setOpenCompare(false))}
      >
        <CompareView
          node={compare.latestUpdatedNode}
          history={compare.history}
          selectedHistory={compare.selectedHistory}
          handleChange={(event) => {
            dispatch(actions.handleCompareChange({ date: event.target.value }));
          }}
        />
      </EditDialog>
    );
  }
  return null;
};

export default CompareNode;
