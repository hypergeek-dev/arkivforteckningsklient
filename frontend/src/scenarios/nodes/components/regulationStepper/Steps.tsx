import { AutoDelete } from '@mui/icons-material';
import { Box, Grid2, Typography } from '@mui/material';
import { requireMaxLength, requiredField } from 'Common/validators';
import { DocumentTypeNodeDto } from 'Models/index';
import { actions, selectors } from 'Store/ducks/app';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect } from 'react';
import { StyledInputForm } from '../forms/InputForm';
import RegulationFilter from './RegulationFilter';
import RegulationList from './RegulationList';
import Paragraph from 'Scenarios/components/TextComponents';

const RuleList = () => {
  const allRules = useAppSelector(selectors.selectRuleList);
  const node = useAppSelector(selectors.selectEditNode) as DocumentTypeNodeDto;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actions.fetchByFilter([[0], [100]]));
  }, []);

  const setSelectedRule = (id: number) => {
    const rule = allRules.find((r) => r.id === id);
    if (rule) {
      if (rule.ruleType === 'DEFAULT_RULE' || rule.ruleType === 'TEXT_RULE') {
        dispatch(actions.setSelectedRule(rule));
      } else {
        dispatch(actions.setSelectedExceptionRule(rule));
      }
      dispatch(actions.setRegulationStepDone(1));
    }
  };
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px' }}
    >
      <Box sx={{ width: '50%', height: '200px' }}>
        <RegulationFilter disabled={false} />
      </Box>
      <Box sx={{ width: '50%' }}>
        <RegulationList
          items={allRules}
          setSelectedRule={setSelectedRule}
          disabled={node.status !== 'utkast'}
          selected={
            node.assignedRules.find(
              (r) => r.ruleType === 'DEFAULT_RULE' || r.ruleType === 'TEXT_RULE'
            )?.id ?? 0
          }
        />
      </Box>
    </Box>
  );
};
const ExceptionList = () => {
  const allRules = useAppSelector(selectors.selectExceptionRuleList);
  const node = useAppSelector(selectors.selectEditNode) as DocumentTypeNodeDto;
  const dispatch = useAppDispatch();
  const assignedRule = node.assignedRules.find(
    (r) => r.ruleType !== 'EXCEPTION_RULE'
  );

  useEffect(() => {
    dispatch(actions.fetchByType('EXCEPTION_RULE'));
  }, []);

  const setSelectedRule = (id: number) => {
    const rule = allRules.find((r) => r.id === id);
    if (rule) {
      dispatch(actions.setSelectedExceptionRule(rule));
      dispatch(actions.setRegulationStepDone(2));
    }
  };
  return (
    <Grid2 sx={{ width: '100%' }} container>
      <Grid2 size={{ xs: 12, md: 6 }}></Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        {assignedRule?.ruleType === 'DEFAULT_RULE' && (
          <RegulationList
            items={allRules}
            setSelectedRule={setSelectedRule}
            disabled={node.status !== 'utkast'}
            selected={
              node.assignedRules.find((r) => r.ruleType === 'EXCEPTION_RULE')
                ?.id ?? 0
            }
          />
        )}
        {assignedRule?.ruleType === 'TEXT_RULE' && (
          <Typography variant="h4" sx={{ marginTop: '2rem' }}>
            Referensregel kan inte kopplas ihop med en undantagsregel.
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
};

const LagRum = () => {
  const node = useAppSelector(selectors.selectEditNode) as DocumentTypeNodeDto;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (node.regulation && node.regulation.length !== 0) {
      dispatch(actions.setRegulationStepDone(3));
    } else {
      dispatch(actions.setRegulationStepDone(2));
    }
  }, []);

  return (
    <Box
      sx={{
        display: { xs: 'block', lg: 'flex' },
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
        <StyledInputForm
          name="regulation"
          title={`Lagrum för gallringsregel *`}
          required={true}
          disabled={node.assignedRules.length === 0 || node.status !== 'utkast'}
          multiline
          rows={8}
          onChangeHandler={(text, val) => {
            dispatch(actions.setEditNode({ ...node, regulation: val }));
            if (val.length !== 0) {
              dispatch(actions.setRegulationStepDone(3));
            } else {
              dispatch(actions.setRegulationStepDone(2));
            }
          }}
          value={node.regulation ?? ''}
          maxLength={900}
          validators={[requiredField(), requireMaxLength(900)]}
        />
      </Box>
    </Box>
  );
};

const Start = () => (
  <Box>
    <Box sx={{ width: '30%', display: 'flex', paddingBottom: '20px' }}>
      <AutoDelete />
      <Typography sx={{ paddingLeft: '6px' }} variant="h2">
        Handlingen bevaras
      </Typography>
    </Box>
    <Typography sx={{ paddingLeft: '6px' }} variant="body1">
      <b>Aktivera gallring</b> genom att följa stegen i den här guiden.
    </Typography>
  </Box>
);

const Finished = () => {
  const node = useAppSelector(selectors.selectEditNode) as DocumentTypeNodeDto;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.setRegulationStepDone(5));
  });

  const assignedRule = node.assignedRules.find(
    (r) => r.ruleType === 'DEFAULT_RULE' || r.ruleType === 'TEXT_RULE'
  );
  const exceptionRule = node.assignedRules.find(
    (r) => r.ruleType === 'EXCEPTION_RULE'
  );

  return (
    <Grid2 sx={{ width: '100%' }} columnGap={4} container>
      <Grid2 size={{ xs: 12, md: 5 }}>
        <Box sx={{ width: '100%', display: 'flex', paddingBottom: '20px' }}>
          <AutoDelete />
          <Typography sx={{ paddingLeft: '6px' }} variant="h2">
            Handlingen gallras
          </Typography>
        </Box>
        <Typography variant="h4">Vald gallringsregel</Typography>
        <Typography variant="body1">{assignedRule?.description}</Typography>
        {assignedRule?.comment && (
          <Typography variant="body1">
            Kommentar: {assignedRule.comment}
          </Typography>
        )}

        {exceptionRule && (
          <Box sx={{ paddingTop: '1rem' }}>
            <Typography variant="h4">Vald undantagsregel</Typography>
            <Typography variant="body1">{exceptionRule.description}</Typography>
          </Box>
        )}
      </Grid2>
      <Grid2 size={{ xs: 12, md: 5 }}>
        <Typography variant="h4">Lagrum gallring</Typography>
        <Paragraph sx={{ overflowY: 'auto', maxHeight: '200px' }}>
          {node.regulation}
        </Paragraph>
      </Grid2>
    </Grid2>
  );
};

interface RuleStep {
  label: string;
  component: JSX.Element;
  key: string;
}

export const steps: RuleStep[] = [
  {
    label: 'Start gallringsguide',
    component: <Start />,
    key: 'start',
  },
  {
    label: 'Välj en gallringsregel',
    component: <RuleList />,
    key: 'chooseRule',
  },
  {
    label: 'Välj en undantagsregel (valfritt)',
    component: <ExceptionList />,
    key: 'chooseException',
  },
  {
    label: 'Ange lagrum för gallring',
    component: <LagRum />,
    key: 'lagrum',
  },
  {
    label: 'Klart',
    component: <Finished />,
    key: 'finished',
  },
];
