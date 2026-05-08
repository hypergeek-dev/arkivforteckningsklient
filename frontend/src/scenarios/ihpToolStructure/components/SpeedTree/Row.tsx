import { ArrowRight, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  ButtonBase,
  Checkbox,
  Menu,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  getParentCode,
  isIHP,
  isKS,
  nodeTypeMapper,
  shortenText,
} from 'Common/helper';
import { CommonNode, NodeName, Status } from 'Models/typed';
import NodetypeIcon from 'Scenarios/components/NodetypeIcon';
import IHPCardBody from 'Scenarios/components/ihpcard/IHPCardBody';
import IHPCardMenu from 'Scenarios/components/menu/IHPCardMenu';
import React, { memo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { areEqual } from 'react-window';
import styles from './Row.module.css';
import { RowData } from './SpeedTree';

interface RowProps {
  data: RowData;
  index: number;
  style?: React.CSSProperties;
}

export type DragRow = {
  id: string;
  index: number;
  status: Status;
  nodeName: NodeName;
};

const Row = memo(({ data, index, style }: RowProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const {
    flattenedData,
    onOpen,
    ksId,
    onSelectCheckbox,
    moveRow,
    findNode,
    disableExpand,
  } = data;
  const node = flattenedData[index];
  const { id, nodeName, status, localPath, path, name } = node.data;
  const depth = path?.split('/') ?? [];
  const left = depth.length * 20;

  const [{ handlerId }, drop] = useDrop({
    accept: ['ROW'],
    canDrop(item: DragRow) {
      console.log('canDrop', item);
      return false;
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },

    hover(item: DragRow) {
      if (item.id !== id) {
        const { index: overIndex } = findNode(id);
        item.index = overIndex;
        moveRow(item.id, overIndex);
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'ROW',
    canDrag: () => status === 'utkast',
    item: () => {
      return { id: node.id, index, nodeName, status };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { id: droppedId, index } = item;
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveRow(droppedId, index);
      }
    },
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disableExpand) onOpen(node);
  };

  return (
    <Box
      ref={ref}
      {...drop}
      key={`node-${localPath}-${id}`}
      data-handler-id={handlerId}
      style={{
        ...style,
        opacity,
      }}
    >
      <Box
        className={`
          ${openInfo && styles.menuOpen}
          ${menuOpen && styles.menuOpen}
        ${theme.palette.mode === 'light' ? styles.hoverLight : styles.hoverDark}
        ${styles.labelGridItem}`}
        style={{
          position: 'relative',
          left: `${left}px`,
          width: `calc(100% - ${left}px)`,
        }}
      >
        <Box
          className={`${styles.expandIconWrapper} ${
            node.collapsed ? styles.isOpen : ''
          }`}
        >
          {node.hasChildren && !disableExpand && (
            <ButtonBase onClick={handleToggle}>
              <ArrowRight aria-label="Öppna trädgren" />
            </ButtonBase>
          )}
        </Box>
        <CheckBoxDisplay
          checked={data.selectStatusIDS.includes(id)}
          handleChange={onSelectCheckbox}
          node={node.data}
          showCheckBox={data.displayCheckbox}
        />
        <IHPCardMenu
          ksId={ksId}
          id={`${id}`}
          nodeName={nodeName}
          status={status || 'utkast'}
          isOpen={setMenuOpen}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            paddingRight: 10,
          }}
          onClick={() => onOpen(node)}
          onKeyDown={() => onOpen(node)}
        >
          <NodetypeIcon size="small" nodeName={nodeName} />
          <Stack
            direction={'row'}
            alignItems={'center'}
            sx={{ width: { lg: '25ch' }, paddingLeft: '6px' }}
          >
            <Typography variant="body1">
              {nodeTypeMapper(nodeName).name}{' '}
              {node.data.nodeName !== 'csnode' && getParentCode(path, true)}
            </Typography>
          </Stack>
          <Stack direction={'row'}>
            <Typography
              sx={{ paddingLeft: { xs: '10px', lg: 0 } }}
              variant="body1"
            >
              <b>{shortenText(name, 100)}</b>
            </Typography>
          </Stack>
        </Box>
        <NodeInfo node={node.data} setOpenInfo={setOpenInfo} open={openInfo} />
      </Box>
    </Box>
  );
}, areEqual);

export default Row;

const NodeInfo: React.FC<{
  node: CommonNode;
  setOpenInfo: (open: boolean) => void;
  open: boolean;
}> = ({ node, setOpenInfo, open }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenInfo(true);
    event.preventDefault();
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenInfo(false);
  };
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingRight: 1,
      }}
    >
      <Tooltip title={'Mer information'} placement="right-start">
        <ButtonBase
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClick(e);
          }}
        >
          <InfoOutlined />
        </ButtonBase>
      </Tooltip>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box
          sx={{
            display: 'block',
            padding: '10px',
          }}
        >
          <IHPCardBody node={node} />
        </Box>
      </Menu>
    </Box>
  );
};
const CheckBoxDisplay: React.FC<{
  node: CommonNode;
  showCheckBox: boolean;
  checked: boolean;
  handleChange: (id: string) => void;
}> = ({ node, showCheckBox, checked, handleChange }) => {
  return (
    <div>
      {showCheckBox && isIHP(node.nodeName) && (
        <Checkbox
          color="primary"
          size="small"
          checked={checked}
          onChange={() => handleChange(node.id)}
        />
      )}
      {showCheckBox && isKS(node.nodeName) && node.status !== 'faststalld' && (
        <Checkbox
          color="primary"
          size="small"
          checked={checked}
          onChange={() => handleChange(node.id)}
        />
      )}
    </div>
  );
};
