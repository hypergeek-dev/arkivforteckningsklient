import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Status } from 'Models/typed';
import StandardDialog from 'Scenarios/components/StandardDialog';
import { actions, selectors } from 'Store/ducks/batchStatus';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useState } from 'react';

interface StatusModalProps {
  open: boolean;
  handleClose: () => void;
  setStatus: (status: Status, comment?: string) => void;
  currentStatus: Status;
  selectedNumber: number;
  warning: boolean;
}
const StatusModal: React.FC<StatusModalProps> = ({
  open,
  handleClose,
  setStatus,
  currentStatus,
  selectedNumber,
  warning,
}) => {
  const statusName = useAppSelector(selectors.selectStatusModalName);
  const ids = useAppSelector(selectors.selectStatusIDS);
  const dispatch = useAppDispatch();
  const [commentValue, setCommentValue] = useState<string>('');
  const authUser = useAppSelector(selectAuthUser);
  return (
    <StandardDialog open={open} handleClose={handleClose}>
      <Grid2 sx={{ width: '400px', padding: 2 }} container>
        <Grid2>
          <Grid2 container>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4">
                Sätt status för ({selectedNumber}) objekt
              </Typography>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2
          sx={{ paddingTop: 1, paddingLeft: warning ? '55px' : 0 }}
          size={{ xs: 12 }}
        >
          <FormControl>
            <RadioGroup
              value={statusName}
              onChange={(e) =>
                dispatch(actions.statusModalChange(e.target.value as Status))
              }
              aria-labelledby="status-radio-buttons-group-label"
              defaultValue="utkast"
              name="radio-buttons-group"
            >
              {currentStatus === 'faststalld' && (
                <>
                  <FormControlLabel
                    value="utkast"
                    control={<Radio />}
                    label="Utkast, (endast IHP)"
                    disabled={!authUser}
                  />
                  <FormControlLabel
                    value="faststalld"
                    control={<Radio />}
                    label="Fastställd, (nuvarande status)"
                    disabled={true}
                  />
                </>
              )}
              {currentStatus === 'utkast' && (
                <>
                  <FormControlLabel
                    value="utkast"
                    control={<Radio />}
                    label="Utkast, (nuvarande status)"
                  />
                  <FormControlLabel
                    value="klar"
                    control={<Radio />}
                    label="Klar"
                  />
                </>
              )}

              {currentStatus === 'klar' && (
                <>
                  <FormControlLabel
                    value="utkast"
                    control={<Radio />}
                    label="Utkast"
                  />
                  <FormControlLabel
                    value="klar"
                    control={<Radio />}
                    label="Klar, (nuvarande status)"
                  />
                  <FormControlLabel
                    value="godkand"
                    control={<Radio />}
                    label="Godkänd"
                    disabled={!authUser}
                  />
                </>
              )}

              {currentStatus === 'godkand' && (
                <>
                  <FormControlLabel
                    value="utkast"
                    control={<Radio />}
                    label="Utkast"
                    disabled={!authUser}
                  />
                  <FormControlLabel
                    value="klar"
                    control={<Radio />}
                    label="Klar"
                    disabled={!authUser}
                  />
                  <FormControlLabel
                    value="godkand"
                    control={<Radio />}
                    label="Godkänd, (nuvarande status)"
                    disabled={!authUser}
                  />
                  <FormControlLabel
                    value="faststalld"
                    control={<Radio />}
                    label="Fastställ, (endast IHP)"
                    disabled={!authUser}
                  />
                </>
              )}
            </RadioGroup>
          </FormControl>
        </Grid2>

        {statusName === 'utkast' && (
          <Grid2 size={{ xs: 12 }}>
            <FormControl fullWidth variant="filled">
              <InputLabel
                aria-label="Kommentar varför ni ändrar till utkast."
                htmlFor="commentStatus"
              >
                Anledning till att ändra till status utkast.
              </InputLabel>
              <OutlinedInput
                id="commentStatus"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <FormHelperText>
                {!commentValue && 'Fältet får inte vara tomt.'}
              </FormHelperText>
            </FormControl>
          </Grid2>
        )}

        <Grid2
          sx={{
            paddingTop: 1,
            paddingLeft: warning ? '55px' : 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          size={{ xs: 12 }}
        >
          <Button
            disabled={currentStatus === statusName || ids.length === 0}
            onClick={() => {
              handleClose();
              setStatus(statusName, commentValue);
            }}
            variant="contained"
          >
            Uppdatera
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="contained"
          >
            Avbryt
          </Button>
        </Grid2>
      </Grid2>
    </StandardDialog>
  );
};

export default StatusModal;
