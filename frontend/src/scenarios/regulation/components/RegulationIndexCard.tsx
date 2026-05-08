import { Box, Grid2, ListItem, Stack, Typography } from '@mui/material';
import { getStatusText } from 'Common/constants';
import { RuleDto } from 'Models/index';
import { RegulationStatus } from 'Models/typed';
import ClickableContent from 'Scenarios/components/ClickableContent';
import ClickMenu from 'Scenarios/components/menu/ClickMenu';

import { shortenText } from 'Common/helper';
import { actions } from 'Store/ducks/regulation';
import { ConfirmOptions } from 'Store/ducks/regulation/reducer';
import { useAppDispatch } from 'Store/hooks';
import moment from 'moment';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import RegulationMenuItems from './RegulationMenuItems';

interface RegulationIndexCardProps {
  rule: RuleDto;
  style?: React.CSSProperties;
}

const RegulationIndexCard: React.FC<RegulationIndexCardProps> = ({
  rule,
  style,
}) => {
  const dispatch = useAppDispatch();

  return (
    <ListItem
      sx={(theme) => ({
        ...style,
        width: '100%',
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
      alignItems="flex-start"
    >
      <Stack width={1}>
        <Grid2 container>
          <Grid2 size={11}>
            <ClickableContent
              dispatch={() => {
                dispatch(actions.openDialog(true));
                dispatch(actions.setSelectedRule(rule));
              }}
              label={`Visa innehåll i ${rule.name}`}
            >
              <Stack></Stack>
              <Typography variant="h4">
                {rule.name} | {typeText(rule.ruleType)}
              </Typography>
            </ClickableContent>
          </Grid2>
          <Grid2 size={1}>
            <RGCardTop
              id={'' + rule.id}
              status={rule.status ?? 'utkast'}
              setOpenConfirm={(n) => {
                dispatch(actions.setSelectedRule(rule));
                dispatch(actions.setConfirm(n));
              }}
            />
          </Grid2>
        </Grid2>

        <Box>
          <ClickableContent
            dispatch={() => {
              dispatch(actions.openDialog(true));
              dispatch(actions.setSelectedRule(rule));
            }}
            label={`Visa innehåll i ${rule.name}`}
          >
            <RGCardContent
              text={rule.description ?? ''}
              comment={rule.comment}
            />
            <RGCardBottom
              date={rule.updatedAt ?? rule.createdAt ?? ''}
              status={rule.status ?? 'utkast'}
            />
          </ClickableContent>
        </Box>
      </Stack>
    </ListItem>
  );
};

interface RGCardTopProps {
  id: string;
  status: RegulationStatus;
  setOpenConfirm: (open: ConfirmOptions) => void;
}

interface RGCardContentProps {
  text: string;
  comment?: string;
}

interface RGCardBottom {
  date: string;
  status: RegulationStatus;
}

function typeText(type: 'DEFAULT_RULE' | 'EXCEPTION_RULE' | 'TEXT_RULE') {
  switch (type) {
    case 'TEXT_RULE':
      return 'referensregel'.toUpperCase();
    case 'EXCEPTION_RULE':
      return 'undantagsregel'.toUpperCase();
    case 'DEFAULT_RULE':
      return 'gallringsregel'.toUpperCase();
  }
  return type;
}

function RGCardTop({ id, status, setOpenConfirm }: Readonly<RGCardTopProps>) {
  const [close, setClose] = useState<string>();
  const handleClose = () => {
    setClose(uuid());
  };

  return (
    <Grid2 size={{ xs: 12 }}>
      <ClickMenu
        id={id}
        close={close}
        menuItems={
          <RegulationMenuItems
            handleClose={handleClose}
            id={id}
            status={status}
            setOpenConfirm={setOpenConfirm}
          />
        }
      />
    </Grid2>
  );
}

function RGCardContent({ text, comment }: Readonly<RGCardContentProps>) {
  return (
    <div
      style={{ width: '100%', display: 'block', minHeight: '60px' }}
      title={`${text} ${comment ? 'Kommentar: ' + comment : ''}`}
    >
      <Typography variant="body1">{shortenText(text, 150)}</Typography>
      {comment && (
        <Typography variant="body2">
          Kommentar: {shortenText(comment, 50)}
        </Typography>
      )}
    </div>
  );
}

function RGCardBottom({ date, status }: Readonly<RGCardBottom>) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <Typography sx={{ fontStyle: 'italic' }} variant="caption">
        <b>{getStatusText(status)}</b>
      </Typography>
      <Typography
        sx={{ marginLeft: '5px', fontStyle: 'italic' }}
        variant="caption"
      >{` ${moment(date + '-00').fromNow()}`}</Typography>
    </div>
  );
}

export default RegulationIndexCard;
