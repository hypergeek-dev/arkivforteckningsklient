import { Box, Stack, Typography } from '@mui/material';
import { CommonNode } from 'Models/typed';
import React, { useEffect, useState } from 'react';
import { nodeById, selectWorkFlat } from 'Store/ducks/data/selectors';
import { useAppSelector } from 'Store/hooks';
import IhpTextFormat from './components/IhpTextFormat';

interface Props {
  fromId: string;
  ksId: string;
}

const IHPReport: React.FC<Props> = ({ fromId, ksId }) => {
  const [loading, setLoading] = useState(true);
  const [snap, setSnap] = useState<CommonNode[]>([]);
  const workDtos = useAppSelector(selectWorkFlat);

  const node = useAppSelector((state) =>
    nodeById(state, parseInt(fromId ?? '0'))
  );

  async function fetchSnap() {
    if (node) {
      setLoading(true);

      if (node.nodeName === 'csnode') {
        // Om noden är en csnode, hämta den direkt
        setSnap(workDtos);
        setLoading(false);
      } else {
        // Skapa en Map för snabbare uppslagning av barn
        console.log('---------------Hämtar snap för nod:', node.name);
        const idToChildren = new Map<number, CommonNode[]>();
        workDtos.forEach((n) => {
          if (n.nodeName === 'csnode') return;
          const parentId = Number(n.parentId);
          if (!idToChildren.has(parentId)) {
            idToChildren.set(parentId, []);
          }
          idToChildren.get(parentId)!.push(n);
        });

        // BFS för att samla alla noder under fromId
        const result: CommonNode[] = [];
        const queue: number[] = [parseInt(fromId)];
        const visited = new Set<number>();

        while (queue.length > 0) {
          const currentId = queue.shift()!;
          if (visited.has(currentId)) continue;
          visited.add(currentId);

          const currentNode = workDtos.find((n) => Number(n.id) === currentId);
          if (currentNode) {
            result.push(currentNode);
            const children = idToChildren.get(currentId) || [];
            for (const child of children) {
              queue.push(Number(child.id));
            }
          }
        }

        setSnap(result);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchSnap();
  }, [ksId, fromId]);

  return (
    <Box sx={{ marginTop: 0, padding: 2, backgroundColor: '#323639' }}>
      {loading ? (
        <Typography
          variant="h2"
          color="#DCDCDC"
          textAlign="center"
          marginTop="2rem"
        >
          Laddar rapport...
        </Typography>
      ) : (
        <Stack>
          {snap.map((node) => (
            <IhpTextFormat key={node.id} node={node} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default IHPReport;
