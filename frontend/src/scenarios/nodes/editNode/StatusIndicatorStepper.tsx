import {
  Assignment,
  AssignmentOutlined,
  AssignmentTurnedIn,
  AssignmentTurnedInOutlined,
  CheckCircle,
  CheckCircleOutlineOutlined,
  Domain,
  DomainDisabledOutlined,
} from '@mui/icons-material';
import { Step, StepButton, Stepper } from '@mui/material';
import { CommonNode, IDNodeNameAction, Status } from 'Models/typed';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useState } from 'react';

import { isKS, requiredFullfilled } from 'Common/helper';
import { actions } from 'Store/ducks/app';
import { structureNodes } from 'Store/ducks/data/selectors';
import { selectDocumentType } from 'Store/ducks/elements/selectors';

const steps = ['Utkast', 'Klar', 'Godkänd', 'Fastställd'];
type StatusIndicatorStepperProps = {
  status: Status;
  authorized: boolean;
  node: CommonNode;
  setOpenConfirm: (v: boolean) => void;
};

const StatusIndicatorStepper: React.FC<StatusIndicatorStepperProps> = ({
  status,
  authorized,
  node,
  setOpenConfirm,
}) => {
  const [activeStep, setActiveStep] = useState(resolveStep(status) ?? 0);
  const nodes = useAppSelector(structureNodes);
  const docType = useAppSelector(selectDocumentType);
  const dispatch = useAppDispatch();

  const stepStyle = {
    width: '100%',
    '& .Mui-active': {
      '& .MuiSvgIcon-root': {
        color: 'primary.main',
      },
      '&.MuiStepLabel-label': {
        fontWeight: '800',
        fontSize: '14px',
        letterSpacing: '1px',
      },
    },
    '& .Mui-completed': {
      '&.MuiStepIcon-root': {
        color: 'primary.main',
        fontSize: '2rem',
      },

      '& .MuiStepConnector-line': {
        borderTopWidth: '3px',
        borderRadius: '2px',
      },
    },
  };

  const icons = [
    <AssignmentOutlined key="AssignmentOutlined" fontSize="small" />,
    <AssignmentTurnedInOutlined
      key="AssignmentTurnedInOutlined"
      fontSize="small"
    />,
    <CheckCircleOutlineOutlined
      key="CheckCircleOutlineOutlined"
      fontSize="small"
    />,
    <DomainDisabledOutlined key="DomainDisabledOutlined" fontSize="small" />,
  ];

  const activeIcons = [
    <Assignment key="Assignment" />,
    <AssignmentTurnedIn key="AssignmentTurnedIn" />,
    <CheckCircle key="CheckCircle" />,
    <Domain key="Domain" />,
  ];

  const filterNotApproved = (ksArray: Array<[string, CommonNode]>) => {
    return ksArray
      .filter(
        (node: [string, CommonNode]) =>
          node[1].status === 'utkast' || node[1].status === 'klar'
      )
      .map((node) => node[1].id);
  };

  const handleDraft = () => {
    const ksNodesArray = Object.entries(nodes).filter((node) =>
      isKS(node[1].nodeName)
    );
    const notEstablishedIds = filterNotApproved(ksNodesArray);
    if (notEstablishedIds.length === 0) {
      setOpenConfirm(true);
    } else {
      dispatch(
        actions.setErrors({
          CHILDREN_NOT_READY: `Hmm, datan verkar korrupt. Ta kontakt med systemadministratör.`,
        })
      );
    }
  };

  const handleKSEstablish = (): boolean => {
    const ksNodesArray = Object.entries(nodes).filter((node) =>
      isKS(node[1].nodeName)
    );
    const notApprovedIds = filterNotApprovedIds(ksNodesArray);

    if (notApprovedIds.length !== 0) {
      dispatch(
        actions.setErrors({
          CHILDREN_NOT_READY: `Det är ${notApprovedIds.length} noder i den här klassificeringsstrukturen som inte är godkända. 
      Godkänn de först och försök sedan igen.`,
        })
      );
      return false;
    }
    return true;
  };

  const filterNotApprovedIds = (
    nodesArray: Array<[string, CommonNode]>
  ): string[] => {
    const ksChildren = nodesArray.slice(1);
    const notGodkandNodes = filterNotApproved(ksChildren);

    return notGodkandNodes;
  };

  const docReady = () => {
    if (node.nodeName === 'documentnode' && node.status === 'utkast') {
      return (
        node.assignedElements.find((elm) => elm.datatype === docType?.id) !==
        undefined
      );
    }
    return true;
  };

  const dateHasPassed = (stopDate: string | undefined): boolean => {
    if (!stopDate) return false;
    return new Date(stopDate) < new Date();
  };

  const draftStepOk = () => {
    if (node.status === 'klar') return true;
    if (!authorized) return false;
    if (node.status === 'godkand') return true;
    if (!isKS(node.nodeName)) return true;
    return node.nodeName === 'csnode' && !dateHasPassed(node.stop);
  };

  const stepAllowed = (step: number): boolean => {
    if (step === resolveStep(node.status)) return false;

    if (step === 0) {
      return draftStepOk();
    }
    // faststall wall for ks-structure
    if (node.status === 'faststalld' && isKS(node.nodeName)) {
      return false;
    }

    if (step === 1)
      return requiredFullfilled(node) && activeStep < 2 && docReady();

    // auth wall
    if (!authorized) return false;

    if (step === 2) {
      return activeStep > 0;
    }

    if (step === 3) {
      if (node.nodeName !== 'csnode' && isKS(node.nodeName)) return false;
      return activeStep > 1;
    }

    // default case - could refactor step 2 here, but more readable the other way
    return false;
  };

  const updateStatus = (index: number) => {
    const nodeNameAction: IDNodeNameAction = {
      id: node.id,
      nodeName: node.nodeName,
    };

    if (index === 0) {
      // everyone can alter to from klar
      if (node.status === 'klar') {
        dispatch(actions.draftNode(nodeNameAction));
        return;
      }
      // if status is above klar, only authorized users can change status
      if (!authorized) return;

      if (node.nodeName === 'csnode' && node.status === 'faststalld') {
        handleDraft();
        return;
      }
      dispatch(actions.draftNode(nodeNameAction));
    }

    if (index === 1) {
      if (requiredFullfilled(node)) {
        dispatch(actions.readyNode(nodeNameAction));
      }
    }

    if (index === 2) dispatch(actions.approveNode(nodeNameAction));

    if (index === 3) {
      if (node.nodeName === 'csnode' && handleKSEstablish()) {
        dispatch(actions.establishNode(nodeNameAction));
        setActiveStep(3);
      } else {
        dispatch(actions.establishNode(nodeNameAction));
        setActiveStep(3);
      }

      return;
    }
  };

  const handleStep = (step: number) => () => {
    if (!stepAllowed(step)) {
      return;
    }

    if (step === 1 && !requiredFullfilled(node)) {
      dispatch(
        actions.setErrors({
          FORM_ERROR: `Det finns fel i formuläret (se markerade fält). Fixa dem, spara och försök igen.`,
        })
      );
      return;
    }

    if (step !== 3) {
      setActiveStep(step);
    }
    updateStatus(step);
  };

  function resolveStep(status: Status) {
    if (status === 'utkast') return 0;
    if (status === 'klar') return 1;
    if (status === 'godkand') return 2;
    if (status === 'faststalld') return 3;
  }

  return (
    <Stepper nonLinear activeStep={activeStep} sx={stepStyle}>
      {steps.map((label, index) => (
        <Step key={label} completed={index <= activeStep}>
          <StepButton
            icon={activeStep === index ? activeIcons[index] : icons[index]}
            color="inherit"
            onClick={handleStep(index)}
            disabled={!stepAllowed(index)}
            title={
              !authorized
                ? 'Bara verksarkivarier kan sätta status högre än klar.'
                : !stepAllowed(index)
                  ? 'Du får inte ändra statusen mer än ett steg åt gången.'
                  : `Ändra status`
            }
          >
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

export default StatusIndicatorStepper;
