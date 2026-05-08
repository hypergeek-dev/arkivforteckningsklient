import { Card, CardContent, Typography } from '@mui/material';
import { STANDARD_DATE_TIME_FORMAT } from 'Models/dataObjects';
import { CommonNode } from 'Models/typed';
import moment from 'moment';
import React from 'react';

import IHPCardBody from './IHPCardBody';
import IHPCardFooter from './IHPCardFooter';
import IHPCardHead from './IHPCardHead';

type CardProps = {
  ksId: string;
  node: CommonNode;
  contentTop?: React.ReactNode;
  warning?: boolean;
};

const IHPCard: React.FC<CardProps> = ({ ksId, node, contentTop, warning }) => {
  return (
    <Card
      sx={() => ({
        height: '399px',
        border: warning ? `2px solid` : 'none',
        borderColor: warning ? 'warning.light' : 'inherit',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '10px',
      })}
      variant="elevation"
      elevation={parent ? 4 : 8}
    >
      <IHPCardHead ksId={ksId} node={node} contentTop={contentTop} />
      <CardContent
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BodyTitle node={node} />

        <IHPCardBody node={node} />

        <IHPCardFooter node={node} />
      </CardContent>
    </Card>
  );
};

export default IHPCard;

/**
 *
 *      AUXILLARY COMPONENTS
 *
 */

function scaleFontSize(text: string): number {
  if (text.length > 40 && text.length < 50) {
    return 14;
  }
  if (text.length > 50) {
    return 12;
  }

  return 22;
}

const BodyTitle: React.FC<{ node: CommonNode }> = ({ node }) => (
  <Typography
    sx={(theme) => ({
      color: theme.palette.mode === 'dark' ? '#ececec' : '#000000',
      fontSize: `${scaleFontSize(node.name)}px`,
      fontWeight: '900',
      letterSpacing: '0px',
      wordBreak: 'break-word',
      display: '-webkit-box',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
    })}
    marginBottom={3}
    variant="subtitle1"
    title={node.name}
  >
    {node.name}
  </Typography>
);

type FormattedDateProps = { date: string | undefined };

export const FormattedDate = ({ date }: FormattedDateProps) => (
  <>{moment(date).format(STANDARD_DATE_TIME_FORMAT)}</>
);
