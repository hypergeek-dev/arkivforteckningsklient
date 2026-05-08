import {
  selectCommandText,
  selectComment,
  selectDummyName,
} from 'Store/ducks/regulation/selectors';
import { useAppSelector } from 'Store/hooks';
import { v4 as uuid } from 'uuid';
import React from 'react';
import { Typography } from '@mui/material';

const CommandInterpreter: React.FC = () => {
  const name = useAppSelector(selectDummyName);
  const text = useAppSelector(selectCommandText);
  const comment = useAppSelector(selectComment);
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#06063D',
        padding: '1rem',
        width: '100%',
        height: '200px',
        color: '#FFFF00',
        borderTopLeftRadius: '25px',
        borderTopRightRadius: '25px',
        fontFamily: 'courier',
        fontSize: '16px',
        fontWeight: 'normal',
      }}
    >
      {name && (
        <Typography
          sx={(theme) => ({
            color: theme.palette.common.white,
            marginBottom: '1rem',
          })}
          variant="h3"
        >
          {name}
        </Typography>
      )}

      {text.map((c) => {
        if (c.type === 'TEXT') {
          return <span key={uuid()}>{`${c.text} `}</span>;
        } else if (c.type === 'TIME') {
          return (
            <span
              key={uuid()}
              style={{ color: '#65FF00' }}
            >{`${c.text} `}</span>
          );
        } else if (c.type === 'TERMATTRIBUTE') {
          return (
            <span
              key={uuid()}
              style={{ color: '#FF8000' }}
            >{`${c.text} `}</span>
          );
        }
      })}
      {comment && <span style={{ color: '#FFFFFF' }}>{`${comment} `}</span>}
      <div
        style={{
          backgroundColor: '#06063D',
          padding: '0.5rem 2rem',
          position: 'absolute',
          top: '180px',
          left: '20px',
          borderRadius: '25px',
        }}
      >
        <Typography
          sx={(theme) => ({ color: theme.palette.common.white })}
          variant="h2"
        >
          Gallringstolken
        </Typography>
      </div>
    </div>
  );
};

export default CommandInterpreter;
