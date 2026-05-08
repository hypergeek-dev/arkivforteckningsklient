import {
  Delete,
  DisplaySettings,
  Edit,
  LockOpenOutlined,
} from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import ClickMenu from 'Scenarios/components/menu/ClickMenu';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { actions } from 'Store/ducks/elements';
import React, { useState } from 'react';
import { ElementDto } from 'Models/index';
import { selectAuthUser } from 'Store/ducks/user/selectors';

type ElementMenuProps = {
  id: number;
  status: ElementDto['status'];
};

const ElementMenu: React.FC<ElementMenuProps> = ({ id, status }) => {
  const [close, setClose] = useState<string>();
  const handleClose = () => {
    setClose(uuid());
  };

  return (
    <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
      <ClickMenu
        id={`${id}`}
        close={close}
        menuItems={
          <ElementMenuItems handleClose={handleClose} id={id} status={status} />
        }
      />
    </div>
  );
};
export default ElementMenu;

type ElementMenuItemsProps = {
  id: number;
  handleClose: () => void;
  status: ElementDto['status'];
};

const ElementMenuItems: React.FC<ElementMenuItemsProps> = ({
  id,
  handleClose,
  status,
}) => {
  const dispatch = useAppDispatch();
  const authorized = useAppSelector(selectAuthUser);

  return (
    <>
      <MenuItem
        tabIndex={0}
        disabled={status === 'ESTABLISHED' && !authorized}
        title="Redigera denna nod."
        aria-label="Redigera"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(actions.fetchAndEditElement({ id }));
          handleClose();
        }}
      >
        <ListItemIcon>
          {status === 'DRAFT' ? (
            <Edit fontSize="small" />
          ) : (
            <DisplaySettings fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>Redigera</ListItemText>
      </MenuItem>
      {status === 'DRAFT' && (
        <MenuItem
          aria-label="Fastställ"
          disabled={!authorized}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(actions.establish({ id }));
            handleClose();
          }}
        >
          <ListItemIcon>
            <LockOpenOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Fastställ</ListItemText>
        </MenuItem>
      )}
      {status === 'DRAFT' && (
        <MenuItem
          aria-label="Radera"
          disabled={!authorized}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(actions.delete({ id }));
            handleClose();
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
