import * as React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import { nodeTypeMapper } from 'Common/helper';
import { useEffect, useState } from 'react';
import { NodeName } from 'Models/typed';

interface Props {
  menuItems: JSX.Element | JSX.Element[];
  id: string;
  nodeName?: NodeName;
  close: string | undefined;
  isOpen?: (o: boolean) => void;
}

const ClickMenu: React.FC<Props> = ({
  menuItems,
  id,
  nodeName,
  close,
  isOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    isOpen?.(true);
    event.stopPropagation();
    event.preventDefault();
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    isOpen?.(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (close) {
      setAnchorEl(null);
    }
  }, [close]);

  if (!id) {
    return null;
  }
  return (
    <div>
      <IconButton
        aria-label={`Open menu for ${
          nodeName ? nodeTypeMapper(nodeName).name : id
        }`}
        id={`ihp-card-menu-positioned-button-${id}`}
        aria-controls={`ihp-card-menu-${id}`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`ihp-card-menu-${id}`}
        anchorEl={anchorEl}
        MenuListProps={{
          'aria-labelledby': `ihp-card-menu-${id}`,
        }}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {menuItems}
      </Menu>
    </div>
  );
};
export default ClickMenu;
