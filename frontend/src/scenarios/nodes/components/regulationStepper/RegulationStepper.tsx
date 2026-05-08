import {
  Box,
  Button,
  ButtonBase,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { actions, selectors } from 'Store/ducks/app';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import styles from './RegulationStepper.module.css';
import { steps } from './Steps';
import { DocumentTypeNodeDto } from 'Models/index';

const RegulationStepper = ({ initialStep }: { initialStep: number }) => {
  const [activeStep, setActiveStep] = React.useState(initialStep);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const dispatch = useAppDispatch();
  const stepDone = useAppSelector(selectors.selectRegulationStepDone);
  const node = useAppSelector(selectors.selectEditNode) as DocumentTypeNodeDto;
  const utkast = node?.status === 'utkast';

  const isStepOptional = (step: number) => {
    return step === 2;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    dispatch(actions.removeExceptionRule());
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    dispatch(actions.setRegulationStepDone(activeStep + 1));
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    if (utkast) {
      dispatch(actions.removeRule());
      setActiveStep(0);
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          if (activeStep === steps.length - 1) {
            stepProps.completed = true;
          }
          return (
            <Step key={step.key} {...stepProps}>
              <ButtonBase onClick={() => stepDone && setActiveStep(index)}>
                <StepLabel>{step.label}</StepLabel>
              </ButtonBase>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <div className={styles.contentWrapper}>
          {steps[steps.length - 1].component}
          <div className={styles.buttonWrapper}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="outlined" onClick={handleReset} disabled={!utkast}>
              NOLLSTÄLL
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          {steps[activeStep].component}

          <div className={styles.buttonWrapper}>
            <Button
              color="inherit"
              variant="outlined"
              disabled={activeStep === 0 || !utkast}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              BAKÅT
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleSkip}
                sx={{ mr: 1 }}
              >
                HOPPA ÖVER
              </Button>
            )}
            {activeStep !== steps.length - 1 && (
              <Button
                variant="outlined"
                disabled={stepDone < activeStep || !utkast}
                onClick={handleNext}
              >
                NÄSTA
              </Button>
            )}
          </div>
        </div>
      )}
    </Box>
  );
};
export default RegulationStepper;
