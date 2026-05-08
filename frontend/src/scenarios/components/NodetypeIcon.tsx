import {
  Circle,
  DescriptionOutlined,
  DeviceHub,
  FolderOpenOutlined,
  Timeline,
  Workspaces,
} from '@mui/icons-material';
import { NodeName } from 'Models/typed';
import * as React from 'react';

interface Props {
  nodeName: NodeName;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  sx?: React.CSSProperties;
  isParent?: boolean;
}

const NodetypeIcon: React.FC<Props> = ({ nodeName, size, sx }) => {
  const defaultStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    ...sx,
  };
  const style = defaultStyle;

  switch (size) {
    case 'small':
      style.width = 20;
      style.height = 20;
      break;
    case 'large':
      style.width = 72;
      style.height = 72;
      break;
    case 'xlarge':
      style.width = 100;
      style.height = 100;
      break;

    default:
      style.width = 35;
      style.height = 35;
      break;
  }

  return (
    <>
      {nodeName === 'csnode' && <DeviceHub sx={{ ...style, color: 'red' }} />}
      {nodeName === 'oanode' && <Circle sx={{ ...style, color: 'red' }} />}
      {nodeName === 'pgnode' && <Workspaces sx={{ ...style, color: 'red' }} />}
      {nodeName === 'processnode' && (
        <Timeline sx={{ ...style, color: 'red' }} />
      )}
      {nodeName === 'issuenode' && <FolderOpenOutlined sx={style} />}
      {nodeName === 'documentnode' && <DescriptionOutlined sx={style} />}
    </>
  );
};

export default NodetypeIcon;
