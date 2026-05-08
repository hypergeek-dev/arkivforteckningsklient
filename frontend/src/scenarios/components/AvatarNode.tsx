import { Avatar } from '@mui/material';
import { nodeTypeMapper } from 'Common/helper';
import { NodeName } from 'Models/typed';
import * as React from 'react';

interface Props {
  nodeName: NodeName;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  sx?: React.CSSProperties;
  isParent?: boolean;
}

const AvatarNode: React.FC<Props> = ({ nodeName, size, sx }) => {
  const defaultStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    fontWeight: 700,
    fontSize: '18px',
    ...sx,
  };
  const style = defaultStyle;

  switch (size) {
    case 'small':
      style.width = 24;
      style.height = 24;
      style.fontSize = '10px';
      break;
    case 'large':
      style.width = 72;
      style.height = 72;
      style.fontWeight = 800;
      style.fontSize = '26px';
      break;
    case 'xlarge':
      style.width = 100;
      style.height = 100;
      style.fontSize = '26px';
      style.fontWeight = 800;
      break;

    default:
      style.width = 35;
      style.height = 35;
      style.fontSize = '16px';
      break;
  }

  return (
    <Avatar sx={{ ...nodeTypeMapper(nodeName).avatarStyle, ...style }}>
      {nodeTypeMapper(nodeName).avatarText}
    </Avatar>
  );
};

export default AvatarNode;
