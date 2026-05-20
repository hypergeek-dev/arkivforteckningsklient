import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { NodeName } from 'Models/typed';
import React, { useEffect, useState } from 'react';

type LegacyMeta = {
  legacyId: string;
  legacySourceSystem: string;
  legacyTable: string;
  importedAt: string | null;
  importBatchId: string | null;
};

type Props = {
  nodeType: NodeName;
  id: string;
};

/**
 * Renders a collapsible accordion with Visual Arkiv import provenance data.
 * Renders nothing when the node was not imported from an external system.
 */
const ImportMetadataCard: React.FC<Props> = ({ nodeType, id }) => {
  const [meta, setMeta] = useState<LegacyMeta | null>(null);

  useEffect(() => {
    if (!id || id === '-1') return;
    fetch(`/rest/app/${nodeType}/${id}/legacy-meta`)
      .then((res) => {
        if (res.status === 204 || !res.ok) return null;
        return res.json() as Promise<LegacyMeta>;
      })
      .then((data) => setMeta(data))
      .catch(() => setMeta(null));
  }, [nodeType, id]);

  if (!meta) return null;

  return (
    <Grid2 size={{ xs: 12 }}>
      <Accordion variant="outlined">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <StorageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Importerad från {meta.legacySourceSystem} — {meta.legacyTable}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell variant="head">Källsystem</TableCell>
                <TableCell>{meta.legacySourceSystem}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Källtabell</TableCell>
                <TableCell>{meta.legacyTable}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Källpost-ID</TableCell>
                <TableCell>{meta.legacyId}</TableCell>
              </TableRow>
              {meta.importedAt && (
                <TableRow>
                  <TableCell variant="head">Importerades</TableCell>
                  <TableCell>{meta.importedAt}</TableCell>
                </TableRow>
              )}
              {meta.importBatchId && (
                <TableRow>
                  <TableCell variant="head">Importbatch</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {meta.importBatchId}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Grid2>
  );
};

export default ImportMetadataCard;
