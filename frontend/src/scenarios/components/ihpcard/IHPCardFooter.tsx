import { Button } from '@mui/material';
import { CommonNode } from 'Models/typed';
import { actions } from 'Store/ducks/app';
import { useAppDispatch } from 'Store/hooks';
import React from 'react';

type IHPCardFooterProps = {
  node: CommonNode;
};

const IHPCardFooter: React.FC<IHPCardFooterProps> = ({ node }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'auto',
        width: '100%',
      }}
    >
      <Button
        variant="outlined"
        onClick={() => {
          dispatch(actions.setEditNode(node));
          dispatch(actions.setOpenEdit('OPEN'));
        }}
      >
        ÖPPNA
      </Button>
    </div>
  );
};

export default IHPCardFooter;
