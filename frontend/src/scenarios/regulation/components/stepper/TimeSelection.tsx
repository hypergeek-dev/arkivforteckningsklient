import { CheckCircleRounded, Circle } from '@mui/icons-material';
import { Chip, Grid2 } from '@mui/material';
import { actions, selectors } from 'Store/ducks/regulation';
import { selectSavedStatus } from 'Store/ducks/regulation/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import ChipSelect from './ChipSelect';

interface TimeSelectionProps {
  storeTimeTerm: 'timeTerm1' | 'timeTerm2';
  immediatelyEnabled?: boolean;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  storeTimeTerm,
  immediatelyEnabled,
}) => {
  const time = useAppSelector(
    storeTimeTerm === 'timeTerm1'
      ? selectors.selectTimeTerm1
      : selectors.selectTimeTerm2
  );
  const savedStatus = useAppSelector(selectSavedStatus);
  const dispatch = useAppDispatch();

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    timeUnit: 'year' | 'month' | 'day'
  ) {
    const amount = parseInt(e.target.value, 10);
    dispatch(
      actions.setTimeTerm({
        type: storeTimeTerm,
        payload: { ...time, [timeUnit]: amount, immediately: false },
      })
    );
  }

  return (
    <Grid2 container>
      <Grid2>
        <ChipSelect
          autoFocus={true}
          tabIndex={1}
          disabled={savedStatus === 'faststalld'}
          selected={time.year !== 0}
          value={time.year}
          onChange={(e) => handleChange(e, 'year')}
          values={[...Array(51)].map((v, i) => ({
            label: `${i} år`,
            value: i,
          }))}
        />
      </Grid2>
      <Grid2>
        <ChipSelect
          autoFocus={false}
          tabIndex={2}
          disabled={savedStatus === 'faststalld'}
          selected={time.month !== 0}
          value={time.month}
          onChange={(e) => handleChange(e, 'month')}
          values={[...Array(12)].map((v, i) => ({
            label: `${i} månader`,
            value: i,
          }))}
        />
      </Grid2>
      <Grid2>
        <ChipSelect
          autoFocus={false}
          tabIndex={3}
          disabled={savedStatus === 'faststalld'}
          selected={time.day !== 0}
          value={time.day}
          onChange={(e) => handleChange(e, 'day')}
          values={[...Array(32)].map((v, i) => ({
            label: `${i} dagar`,
            value: i,
          }))}
        />
      </Grid2>
      {immediatelyEnabled && (
        <Grid2>
          <Chip
            tabIndex={4}
            disabled={savedStatus === 'faststalld'}
            icon={
              time.immediately ? (
                <CheckCircleRounded color="primary" />
              ) : (
                <Circle color="disabled" />
              )
            }
            label="Omedelbart"
            variant="outlined"
            onClick={() =>
              dispatch(
                actions.setTimeTerm({
                  type: storeTimeTerm,
                  payload: {
                    year: 0,
                    month: 0,
                    day: 0,
                    immediately: true,
                  },
                })
              )
            }
          />
        </Grid2>
      )}
    </Grid2>
  );
};

export default TimeSelection;
