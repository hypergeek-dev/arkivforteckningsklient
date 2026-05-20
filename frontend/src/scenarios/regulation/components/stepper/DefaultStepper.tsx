import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material';
import { PayloadAction } from '@reduxjs/toolkit';
import { timeTermSelected } from 'Common/regulation';
import { DefaultStep } from 'Models/typed';
import { actions } from 'Store/ducks/regulation/reducer';
import {
  selectActiveStep,
  selectCreateType,
  selectDummyName,
  selectDummyText,
  selectEventTerm1,
  selectEventTerm2,
  selectTimeTerm1,
  selectTimeTerm2,
} from 'Store/ducks/regulation/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';

interface DefaultStepperProps {
  steps: DefaultStep[];
  dispatch: (n: PayloadAction<unknown>) => void;
}

const DefaultStepper: React.FC<DefaultStepperProps> = ({ steps, dispatch }) => {
  const eventTerm1 = useAppSelector(selectEventTerm1);
  const eventTerm2 = useAppSelector(selectEventTerm2);
  const timeTerm1 = useAppSelector(selectTimeTerm1);
  const timeTerm2 = useAppSelector(selectTimeTerm2);
  const activeStep = useAppSelector(selectActiveStep);
  const selectedRuleType = useAppSelector(selectCreateType);
  const dummyyname = useAppSelector(selectDummyName);
  const dummyText = useAppSelector(selectDummyText);
  const theme = useTheme();

  const disabelNext = (step: DefaultStep): boolean => {
    if (step.key === 'CREATE') return false;
    if (selectedRuleType === 'TEXT_RULE') {
      switch (step.key) {
        case 'EVENT1':
          return dummyyname.length === 0;
        case 'EVENT2':
          return dummyText.length === 0;
        default:
          break;
      }
      return true;
    }

    if (step.key === 'EVENT1' && eventTerm1) return false;
    if (step.key === 'EVENT2' && eventTerm2) return false;
    if (step.key === 'TIME1' && timeTermSelected(timeTerm1)) return false;
    if (step.key === 'TIME2' && timeTermSelected(timeTerm2)) return false;
    if (step.key === 'COMMENT') return false;
    if (step.key === 'ARCHIVAL_META') return false;

    return true;
  };

  const handleNext = () => {
    let preAvtiveStep = activeStep + 1;
    if (preAvtiveStep < steps.length)
      steps.forEach((step, i) => {
        if (step.disabled && i === preAvtiveStep) {
          preAvtiveStep++;
        }
      });
    dispatch(actions.setActiveStep(preAvtiveStep));
  };

  const handleBack = () => {
    dispatch(actions.setActiveStep(activeStep - 1));
  };

  const handleReset = () => {
    dispatch(actions.resetStepper());
  };

  return (
    <div
      style={{
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        padding: '4rem 2rem',
        border: '1px solid #0000002E',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        key={`stepper-${selectedRuleType}`}
      >
        {steps.map((step, index) => (
          <Step disabled={step.disabled} key={`step-${index}`}>
            <StepLabel>{step.disabled ? 'inte aktuell' : step.label}</StepLabel>

            <StepContent key={`stepcontent-${index}`}>
              {step.content}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={disabelNext(step)}
                    variant="text"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Klar' : 'Nästa'}
                  </Button>
                  {eventTerm1 &&
                    eventTerm1 === 'ISSUE_END' &&
                    step.key === 'EVENT1' && (
                      <Button
                        variant="text"
                        color="success"
                        disabled={index === 0}
                        onClick={() => {
                          dispatch(actions.completeRule(''));
                          dispatch(actions.setActiveStep(steps.length - 1));
                        }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Klar
                      </Button>
                    )}
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Tillbaka
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography variant="body1">Godkänd regel!</Typography>
          <Typography variant="body1">
            Du kan nu välja att <b>fastställa</b> regeln eller spara den som
            utkast.
          </Typography>
          <Button variant="text" onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Börja om
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default DefaultStepper;
