import { CheckCircleRounded, Circle } from '@mui/icons-material';
import { Chip, Grid2 } from '@mui/material';
import { DEFINED_ATTRIBUTES } from 'Common/regulation';
import { TermAttribute } from 'Models/typed';
import { actions, selectors } from 'Store/ducks/regulation';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import { selectSavedStatus } from 'Store/ducks/regulation/selectors';

interface EventSelectionProps {
  storeEventTerm: 'eventTerm1' | 'eventTerm2';
  termAttributes: TermAttribute[];
}

const EventSelection: React.FC<EventSelectionProps> = ({
  storeEventTerm,
  termAttributes,
}) => {
  const selectedAttribute = useAppSelector(
    storeEventTerm === 'eventTerm1'
      ? selectors.selectEventTerm1
      : selectors.selectEventTerm2
  );
  const savedStatus = useAppSelector(selectSavedStatus);
  const dispatch = useAppDispatch();

  function handleClick(e: TermAttribute) {
    dispatch(
      actions.setEventTerm({
        type: storeEventTerm,
        payload: e,
      })
    );
  }

  return (
    <Grid2 container>
      {termAttributes.map((attribute) => (
        <Grid2 key={'event-select-' + attribute}>
          <Chip
            icon={
              selectedAttribute === attribute ? (
                <CheckCircleRounded />
              ) : (
                <Circle />
              )
            }
            label={DEFINED_ATTRIBUTES[attribute].label}
            variant="outlined"
            onClick={() => {
              if (savedStatus !== 'faststalld') handleClick(attribute);
            }}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default EventSelection;
