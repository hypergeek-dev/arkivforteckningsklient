import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { displayDateWithTimezone } from 'Common/helper';
import { CommonNode } from 'Models/typed';
import React from 'react';
import { v4 as uuid } from 'uuid';
import AvatarNode from '../AvatarNode';
import { KSRows, OARows } from './MappedRow';

import { DocumentRows } from './DocumentRows';
import { IssueRows } from './IssueRows';
import { ProcessRows } from './ProcessRows';

interface CompareViewProps {
  node: CommonNode;
  history: CommonNode[];
  selectedHistory?: CommonNode;
  handleChange: (event: SelectChangeEvent) => void;
}

const CompareView: React.FC<CompareViewProps> = ({
  node,
  history,
  selectedHistory,
  handleChange,
}) => {
  if (!node) return null;

  return (
    <Container
      sx={{
        overflowY: 'auto',
        width: '100%',
        marginTop: '3rem',
        borderRadius: '2rem',
        paddingBottom: '2px',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{ borderRadius: '2rem', paddingBottom: '2rem' }}
      >
        <CompareViewHeader
          node={node}
          selectedHistory={selectedHistory}
          handleChange={handleChange}
          history={history}
        />
        <CompareViewTable node={node} selectedHistory={selectedHistory} />
      </TableContainer>
    </Container>
  );
};

export default CompareView;

function CompareSelectItem(s: CommonNode): JSX.Element {
  const uniqueid = uuid();
  const date = s.updated ?? s.createdAt;
  const user = s.updatedBy ?? s.createdBy;
  return (
    <MenuItem key={`history-${uniqueid}`} value={date}>
      {`${displayDateWithTimezone(date)} - ${user}`}
    </MenuItem>
  );
}

/**
 *
 *            COMPARE VIEW COMPONENTS
 *
 */

type CompareViewHeaderProps = {
  node: CommonNode;
  selectedHistory?: CommonNode;
  history: CommonNode[];
  handleChange: (event: SelectChangeEvent) => void;
};

function CompareViewHeader({
  node,
  history,
  selectedHistory,
  handleChange,
}: Readonly<CompareViewHeaderProps>) {
  const latestVersionHeader = `${displayDateWithTimezone(node.updated)} - ${
    node.updatedBy ?? node.createdBy
  }`;
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          paddingBlock: '2rem',
        }}
      >
        <AvatarNode nodeName={node.nodeName} size="large" />
        <div className="placeholder-div"></div>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          paddingInline: '1rem',
        }}
      >
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingBottom: '2.0rem',
          }}
        >
          <Typography variant="h3" marginBottom="1rem">
            Senaste versionen
          </Typography>

          <Typography
            variant="body1"
            sx={{
              paddingBlock: '0.85rem',
              border: '1px solid #c3c3c3',
              borderRadius: '4px',
              paddingLeft: '1rem',
              width: '90%',
            }}
          >
            {latestVersionHeader}
          </Typography>
        </div>

        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingBottom: '2.0rem',
          }}
        >
          <Typography variant="h3" marginBottom="1rem">
            Tidigare version
          </Typography>
          <FormControl hiddenLabel>
            <InputLabel id="version-select-label">
              {history.length === 0 ? 'Inga tidigare versioner' : ''}
            </InputLabel>
            {selectedHistory && (
              <Select
                labelId="version-select-label"
                id="version-select"
                value={selectedHistory.updated ?? selectedHistory.createdAt}
                label="Version"
                onChange={handleChange}
              >
                {history.map((s) => CompareSelectItem(s))}
              </Select>
            )}
          </FormControl>
        </div>
      </Box>
    </>
  );
}

type CompareViewTableProps = {
  node: CommonNode;
  selectedHistory?: CommonNode;
};

const CompareViewTable: React.FC<CompareViewTableProps> = ({
  node,
  selectedHistory,
}) => {
  return (
    <Table sx={{ width: '100%' }} aria-label="customized table">
      <TableBody>
        {node && node.nodeName === 'csnode' && (
          <KSRows
            currentNode={node}
            compareNode={
              selectedHistory?.nodeName === 'csnode'
                ? selectedHistory
                : undefined
            }
          />
        )}

        {node && node.nodeName === 'oanode' && (
          <OARows
            currentNode={node}
            compareNode={
              selectedHistory?.nodeName === 'oanode'
                ? selectedHistory
                : undefined
            }
          />
        )}

        {node && node.nodeName === 'pgnode' && (
          <ProcessRows
            currentNode={node}
            compareNode={
              selectedHistory && selectedHistory.nodeName === 'pgnode'
                ? selectedHistory
                : undefined
            }
          />
        )}

        {node && node.nodeName === 'processnode' && (
          <ProcessRows
            currentNode={node}
            compareNode={
              selectedHistory && selectedHistory.nodeName === 'processnode'
                ? selectedHistory
                : undefined
            }
          />
        )}

        {node && node.nodeName === 'issuenode' && (
          <IssueRows
            currentNode={node}
            compareNode={
              selectedHistory && selectedHistory.nodeName === 'issuenode'
                ? selectedHistory
                : undefined
            }
          />
        )}

        {node && node.nodeName === 'documentnode' && (
          <DocumentRows
            currentNode={node}
            compareNode={
              selectedHistory && selectedHistory.nodeName === 'documentnode'
                ? selectedHistory
                : undefined
            }
          />
        )}
      </TableBody>
    </Table>
  );
};
