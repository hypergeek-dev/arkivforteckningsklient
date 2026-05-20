import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { CommonNode } from 'Models/typed';
import { ProcessTypeNodeDto } from 'Models/index';
import React from 'react';

const IhpTextFormat = ({ node }: { node: CommonNode }) => {
  let variant: Variant = 'body1';
  let prefix = node.localPath + ' ';
  const depth = node.localPath?.split('.').length;
  switch (node.nodeName) {
    case 'csnode':
      variant = 'h1';
      prefix = '';
      break;
    case 'oanode':
      variant = 'h2';
      break;
    case 'pgnode':
      variant = 'h3';
      break;
    case 'processnode': {
      variant = 'h4';
      const signum = (node as ProcessTypeNodeDto).seriesignum;
      if (signum) prefix = `${node.localPath} [${signum}] `;
      break;
    }
    case 'issuenode':
      prefix = `${node.localPath} (US) `;
      break;
    case 'documentnode':
      prefix = `${node.localPath} (V) `;
      break;
  }
  return (
    <Typography
      variant={variant}
      marginBottom="1rem"
      paddingLeft={depth}
      color="#DCDCDC"
    >
      {prefix} {node.name}
    </Typography>
  );
};
export default IhpTextFormat;
