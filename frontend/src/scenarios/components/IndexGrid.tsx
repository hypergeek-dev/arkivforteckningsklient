import { Box, Grid2 } from '@mui/material';
import { CommonNode } from 'Models/typed';
import IHPCard from 'Scenarios/components/ihpcard/IHPCard';
import React from 'react';

interface Props {
  ksID: string;
  data: CommonNode[];
  checkBox?: (id: CommonNode) => React.ReactNode;
  warningIds?: string[];
}

const CardGrid: React.FC<Props> = ({ ksID, data, checkBox, warningIds }) => (
  <Box sx={{ margin: { xs: 0, lg: '0 5rem 0 4rem' } }}>
    <Grid2
      sx={{ maxWidth: '1500px' }}
      spacing={2}
      columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
      container
    >
      {data.map((node) => {
        if (node) {
          const cols = 1;
          return (
            <Grid2 key={`gridcard-${node?.id}`} size={{ xs: 1, md: cols }}>
              <IHPCard
                ksId={ksID}
                warning={warningIds?.includes(node.id)}
                contentTop={checkBox?.(node)}
                key={node.id}
                node={node}
              />
            </Grid2>
          );
        }
      })}
    </Grid2>
  </Box>
);
export default CardGrid;
