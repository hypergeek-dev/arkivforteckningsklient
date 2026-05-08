import { ButtonBase, Divider, Grid2 } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import {
  displayDateWithTimezone,
  getOwnClassCodeFromPath,
  getParentCode,
  isKS,
  removeUUIDFromPath,
} from 'Common/helper';
import { EventLogDto } from 'Models/index';
import AvatarNode from 'Scenarios/components/AvatarNode';
import { actions } from 'Store/ducks/eventlogg/reducer';
import { useAppDispatch } from 'Store/hooks';
import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface ResultListProps {
  data: EventLogDto[];
}

const ResultList = ({ data }: ResultListProps) => {
  return (
    <List
      style={{ marginBottom: '32px' }}
      width={'100%'}
      height={500}
      itemCount={data.length}
      itemSize={80}
    >
      {({ index, style }) => <Row index={index} style={style} data={data} />}
    </List>
  );
};

const Row = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: EventLogDto[];
}) => {
  const item = data[index];
  return (
    <EventListItem
      event={item}
      key={`EventListItem-${item.created}-${item.action}-${item.objectId}`}
      style={style}
    />
  );
};

export default React.memo(ResultList);

type EventListItemProps = {
  event: EventLogDto;
  style?: React.CSSProperties;
};

function EventListItem({ event, style }: Readonly<EventListItemProps>) {
  const dispatch = useAppDispatch();
  return (
    <div style={style}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <AvatarNode nodeName={event.type} />
        </ListItemAvatar>
        <ButtonBase
          sx={{ width: '100%' }}
          onClick={() => dispatch(actions.fetchSelectedNode(event))}
        >
          <Grid2 container>
            <Grid2 size={{ xs: 12 }} sx={{ display: 'flex' }}>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                <b>{actionMapper(event)}</b> |{' '}
                {isKS(event.type)
                  ? shortenString(
                      getOwnClassCodeFromPath(
                        removeUUIDFromPath(event.modelId)
                      ),
                      30
                    )
                  : shortenString(
                      `${getParentCode(
                        removeUUIDFromPath(event.modelId),
                        true
                      )} / ${getOwnClassCodeFromPath(
                        removeUUIDFromPath(event.modelId)
                      )}`,
                      30
                    )}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} sx={{ textAlign: 'left' }}>
              <Typography variant="body1">
                {shortenString(event.objectName, 30)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {event.userId}, {displayDateWithTimezone(event.created)}
              </Typography>
            </Grid2>
          </Grid2>
        </ButtonBase>
      </ListItem>
      <Divider />
    </div>
  );
}

function shortenString(str?: string, chars?: number) {
  if (!str) return '';
  if (!chars) return str;
  return str.length > chars ? `${str.substring(0, chars - 1)}...` : str;
}

function actionMapper(event: EventLogDto) {
  switch (event.action) {
    case 'comment':
      return 'Kommentar';
    case 'create':
      return 'Skapat';
    case 'delete':
      return 'Raderat';
    case 'copy':
      return 'Kopierat';
    case 'move':
      return 'Flyttad';
    case 'faststalld':
      return 'Fastställd';
    case 'godkand':
      return 'Godkänd';
    case 'klar':
      return 'Klar';
    case 'update':
      return 'Uppdaterat';
    case 'utkast':
      return 'Utkast';
    default:
      break;
  }
}
