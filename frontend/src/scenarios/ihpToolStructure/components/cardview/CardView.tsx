import { Box, Checkbox, Stack, TablePagination } from '@mui/material';
import { isIHP, isKS } from 'Common/helper';
import { CommonNode } from 'Models/typed';
import IndexGrid from 'Scenarios/components/IndexGrid';
import { selectors } from 'Store/ducks/IHPToolStructure';
import {
  actions as statusActions,
  selectors as statusSelectors,
} from 'Store/ducks/batchStatus';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';

const CardView = () => {
  const treeData = useAppSelector(selectors.selectFilteredCommonNodes);
  const ksID = useAppSelector(selectors.selectedKsID);
  const selected = useAppSelector(statusSelectors.selectStatusIDS);
  const statusFilter = useAppSelector(selectors.selectStatusFilter);
  const dispatch = useAppDispatch();

  const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState(treeData.slice(0, 10));
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    if (treeData) {
      setData(treeData.slice(0, rowsPerPage));
      setPage(0);
    }
  }, [treeData]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    const fromIndex = newPage * rowsPerPage;
    console.log('Från ', fromIndex, ' till ', fromIndex + rowsPerPage);
    setData(treeData.slice(fromIndex, fromIndex + rowsPerPage));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rows = parseInt(event.target.value, 10);
    setRowsPerPage(rows);
    setData(treeData.slice(0, rows));
    setPage(0);
  };

  const handleCheckBox = (id: string, checked: boolean) => {
    if (checked) {
      dispatch(statusActions.setStatusIDS([...selected, id]));
    } else {
      const ids = selected.filter((nid) => nid !== id);
      dispatch(statusActions.setStatusIDS(ids));
    }
  };

  if (!ksID) return null;

  return (
    <Box>
      <IndexGrid
        ksID={`${ksID}`}
        checkBox={(node) => (
          <CheckBoxDisplay
            handleCheckBox={(id, checked) => handleCheckBox(id, checked)}
            checked={selected.includes(node.id)}
            showCheckBox={statusFilter !== 'Alla'}
            node={node}
          />
        )}
        data={data.filter((t) => t.nodeName !== 'csnode')}
      />

      <Box
        sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}
      >
        <Stack sx={{ width: '400px' }} spacing={2}>
          <TablePagination
            count={treeData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>
      </Box>
    </Box>
  );
};
export default CardView;

const CheckBoxDisplay: React.FC<{
  node: CommonNode;
  showCheckBox: boolean;
  checked: boolean;
  handleCheckBox: (id: string, checked: boolean) => void;
}> = ({ node, showCheckBox, checked, handleCheckBox }) => {
  return (
    <div>
      {showCheckBox && isIHP(node.nodeName) && (
        <Checkbox
          color="primary"
          size="small"
          checked={checked}
          onChange={(e, checked) => handleCheckBox(node.id, checked)}
        />
      )}
      {showCheckBox && isKS(node.nodeName) && node.status !== 'faststalld' && (
        <Checkbox
          color="primary"
          size="small"
          checked={checked}
          onChange={(e, checked) => handleCheckBox(node.id, checked)}
        />
      )}
    </div>
  );
};
