import { Stack, Typography, useTheme } from '@mui/material';
import { Label, LabelOutlined } from '@mui/icons-material';
import { STANDARD_DATE_FORMAT } from 'Models/dataObjects';
import { ElementDataTypeDto, ElementDto } from 'Models/index';
import moment from 'moment';
import * as React from 'react';
import ElementMenu from './ElementMenu';
import { DATA_TYPE } from '../constants';

interface ElementListItemProps {
  element: ElementDto;
  style: React.CSSProperties;
  datatypes: ElementDataTypeDto[];
  consumer?: boolean;
  showExtraInfo?: boolean;
}

const ElementListItem: React.FC<ElementListItemProps> = ({
  element,
  style,
  datatypes,
  consumer,
  showExtraInfo,
}) => {
  const type = datatypes.find((d) => d.id === element.datatype);
  const theme = useTheme();

  return (
    <div
      style={{
        ...style,
        padding: '1rem',
        paddingLeft: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-25px',
            top: '-5px',
          }}
        >
          {element.status === 'ESTABLISHED' ? (
            <Label
              sx={(theme) => ({
                transform: 'rotate(30deg)',
                color: theme.palette.grey[700],
              })}
            />
          ) : (
            <LabelOutlined
              sx={(theme) => ({
                transform: 'rotate(30deg)',
                color: theme.palette.grey[700],
              })}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Stack>
            <Typography variant="body2">
              #{element.datatype === 6 ? 'Dokumenttyp' : 'Eget element'}
            </Typography>
            <Typography variant="h4">{element.name}</Typography>
          </Stack>
          <div>
            {element.id && !consumer && (
              <ElementMenu id={element.id} status={element.status} />
            )}
          </div>
        </div>
      </div>
      <div>
        {showExtraInfo && (
          <Typography variant="body2" style={{ textTransform: 'capitalize' }}>
            <b>Gäller för: </b>
            {`${
              element.nodeType === 'DOCUMENT' ? 'Handlingstyp' : 'Ärendetyp'
            }`}
          </Typography>
        )}
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
          <b>Beskrivning</b> {element.description}
        </Typography>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" style={{ textTransform: 'capitalize' }}>
          <b>Datatyp: </b>
          {type && `${DATA_TYPE[type.type]}`}
        </Typography>
        <Typography variant="body2">{`${moment(element.startDate).format(
          STANDARD_DATE_FORMAT
        )} - ${
          moment(element.endDate).diff(moment(), 'years') > 100
            ? 'Tillsvidare'
            : moment(element.endDate).format(STANDARD_DATE_FORMAT)
        }`}</Typography>
      </div>
    </div>
  );
};
export default ElementListItem;
