import { Grid2, Typography } from '@mui/material';
import { getParentCode, nodeTypeMapper } from 'Common/helper';
import { CommonNode } from 'Models/typed';
import React from 'react';
import NodetypeIcon from '../NodetypeIcon';
import IHPCardMenu from '../menu/IHPCardMenu';

type IHPCardHeadProps = {
  ksId: string;
  node: CommonNode;
  contentTop?: React.ReactNode;
};

const IHPCardHead: React.FC<IHPCardHeadProps> = ({
  ksId,
  node,
  contentTop,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        padding: '0 1em',
      }}
    >
      <Grid2
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px',
        }}
        padding={'0'}
        minWidth={'calc(50% + 36px)'}
        container
      >
        <Grid2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NodetypeIcon size="small" nodeName={node.nodeName} />
            <Typography
              variant="body1"
              sx={{
                paddingLeft: '6px',
              }}
            >
              {nodeTypeMapper(node.nodeName).name}{' '}
              {getParentCode(node.path, true)}
            </Typography>
          </div>
        </Grid2>

        <Grid2 sx={{ display: 'flex' }}>
          <IHPCardMenu
            ksId={ksId}
            id={node.id}
            nodeName={node.nodeName}
            status={node.status}
          />
          {contentTop}
        </Grid2>
      </Grid2>
    </div>
  );
};

export default IHPCardHead;
