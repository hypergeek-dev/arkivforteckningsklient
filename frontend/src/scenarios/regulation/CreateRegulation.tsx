import { Container } from '@mui/material';
import { DefaultStep } from 'Models/typed';
import { selectors } from 'Store/ducks/regulation';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';
import CommandInterpreter from './components/CommandInterpreter';
import RuleChipSelector from './components/RuleSelector';
import CommentStep from './components/stepper/CommentStep';
import DefaultStepper from './components/stepper/DefaultStepper';
import EventSelection from './components/stepper/EventSelection';
import FreeTextSelection, {
  DummyName,
} from './components/stepper/FreeTextSelection';
import TimeSelection from './components/stepper/TimeSelection';

const defaultRuleSteps: DefaultStep[] = [
  {
    uniqueKey: 'create',
    key: 'CREATE',
    label: 'Välj vilken regeltyp du vill skapa',
    content: <RuleChipSelector />,
  },
  {
    uniqueKey: 'tid1',
    key: 'TIME1',
    label: 'Ange tid',
    content: <TimeSelection storeTimeTerm="timeTerm1" immediatelyEnabled />,
  },
  {
    uniqueKey: 'event1',
    key: 'EVENT1',
    label: 'Ange händelse',
    content: (
      <EventSelection
        storeEventTerm="eventTerm1"
        termAttributes={['ISSUE_END', 'DOCUMENT_RECEIVED', 'DOCUMENT_ACCEPTED']}
      />
    ),
  },
  {
    uniqueKey: 'event2',
    key: 'EVENT2',
    label: 'Ange händelse 2',
    content: (
      <EventSelection
        storeEventTerm="eventTerm2"
        termAttributes={['DOCUMENT_ACCEPTED', 'DOCUMENT_RECEIVED']}
      />
    ),
  },
  {
    uniqueKey: 'tid2',
    key: 'TIME2',
    label: 'Ange tid 2',
    content: <TimeSelection storeTimeTerm="timeTerm2" />,
  },
  {
    uniqueKey: 'comment',
    key: 'COMMENT',
    label: 'Lägg till en kommentar',
    content: <CommentStep key="commentField" />,
  },
];

const exceptionRuleSteps: DefaultStep[] = [
  {
    uniqueKey: 'create',
    key: 'CREATE',
    label: 'Välj vilken regeltyp du vill skapa',
    content: <RuleChipSelector />,
  },
  {
    uniqueKey: 'event1',
    key: 'EVENT1',
    label: 'Ange händelse',
    content: (
      <EventSelection
        storeEventTerm="eventTerm1"
        termAttributes={[
          'ISSUE_APPEALED',
          'RELATED_ISSUE_APPEALED',
          'RELATED_ISSUE_REVIEWED',
          'ISSUE_REVIEWED',
        ]}
      />
    ),
  },
];

const textRuleSteps: DefaultStep[] = [
  {
    uniqueKey: 'create',
    key: 'CREATE',
    label: 'Välj vilken regeltyp du vill skapa',
    content: <RuleChipSelector />,
  },
  {
    uniqueKey: 'dummyName',
    key: 'EVENT1',
    label: 'Namnge referensregel',
    content: <DummyName key="dumName" />,
  },
  {
    uniqueKey: 'villkortext',
    key: 'EVENT2',
    label: 'Beskriv referensregelns villkor',
    content: <FreeTextSelection key="villkorevent1" />,
  },
];

const CreateRegulation = () => {
  const selectedRuleType = useAppSelector(selectors.selectCreateType);
  const selectedSteps = useAppSelector(selectors.selectSteps);

  const dispatch = useAppDispatch();
  const [steps, setSteps] = useState<DefaultStep[]>([]);

  useEffect(() => {
    if (selectedRuleType) {
      switch (selectedRuleType) {
        case 'DEFAULT_RULE':
          setSteps(defaultRuleSteps);
          break;
        case 'EXCEPTION_RULE':
          setSteps(exceptionRuleSteps);
          break;
        case 'TEXT_RULE':
          setSteps(textRuleSteps);
          break;
        default:
          break;
      }
    }
  }, [selectedRuleType]);

  return (
    <Container sx={{ marginTop: '20px' }} maxWidth="md">
      <CommandInterpreter />

      <DefaultStepper
        steps={steps.filter((s) => selectedSteps.includes(s.key))}
        dispatch={dispatch}
        key={`stepper`}
      />
    </Container>
  );
};

export default CreateRegulation;
