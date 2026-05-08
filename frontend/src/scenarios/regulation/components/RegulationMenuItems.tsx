import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch } from 'Store/hooks';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  Delete,
  Edit,
  DisplaySettings,
  LockOpenOutlined,
} from '@mui/icons-material';
import { actions } from 'Store/ducks/regulation';
import { RegulationStatus } from 'Models/typed';

interface Props {
  id: string;
  status: RegulationStatus;
  handleClose: () => void;
  setOpenConfirm: (action: 'DELETE' | 'FASTSTALL' | 'CLOSE') => void;
}

const RegulationMenuItems: React.FC<Props> = ({
  id,
  handleClose,
  setOpenConfirm,
  status,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <MenuItem
        tabIndex={0}
        title="Redigera denna nod."
        aria-label="Redigera"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(actions.openDialog(true));
          dispatch(actions.getRule(id));
          handleClose();
        }}
      >
        <ListItemIcon>
          {status === 'utkast' ? (
            <Edit fontSize="small" />
          ) : (
            <DisplaySettings fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>Redigera</ListItemText>
      </MenuItem>
      {status === 'utkast' && (
        <MenuItem
          aria-label="Fastställ"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
            setOpenConfirm('FASTSTALL');
          }}
        >
          <ListItemIcon>
            <LockOpenOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Fastställ</ListItemText>
        </MenuItem>
      )}
      {status === 'utkast' && (
        <MenuItem
          aria-label="Radera"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
            setOpenConfirm('DELETE');
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Radera</ListItemText>
        </MenuItem>
      )}
    </>
  );
};
export default RegulationMenuItems;
