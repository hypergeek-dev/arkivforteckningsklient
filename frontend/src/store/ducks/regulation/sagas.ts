/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import {
  CommandTextObject,
  DEFINED_ATTRIBUTES,
  createRuleName,
  createTerm,
} from 'Common/regulation';
import { OpenAPI, RuleControllerService, RuleDto, TermDto } from 'Models/index';
import { RegulationTypes, StepKey, TermAttribute } from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import { actions as appActions } from 'Store/ducks/app';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  RegulationState,
  SaveRuleOption,
  actions,
  initialState,
  initialTimeTerm,
} from './reducer';
import { v4 as uuid } from 'uuid';
import {
  selectCommandText,
  selectCreateType,
  selectRegulationState,
} from './selectors';
import { selectUserName } from '../user/selectors';

const port = window.location.port;

if (port === '3000') {
  OpenAPI.BASE = 'http://localhost:3000';
} else {
  OpenAPI.BASE = '/ihpappbackend';
}
OpenAPI.HEADERS = RestHeaders.get;

function* createTypeChange(action: PayloadAction<RegulationTypes>) {
  const regulation = action.payload;
  yield put(actions.resetState({ ...initialState, createType: regulation }));
  switch (regulation) {
    case 'DEFAULT_RULE':
      yield put(
        actions.setSteps(DEFINED_ATTRIBUTES['ISSUE_END'].steps as StepKey[])
      );
      break;
    case 'EXCEPTION_RULE':
      yield put(
        actions.setSteps(
          DEFINED_ATTRIBUTES['RELATED_ISSUE_ENDED'].steps as StepKey[]
        )
      );
      break;
    default:
      break;
  }
}

function* eventTermChange(
  action: PayloadAction<{
    type: 'eventTerm1' | 'eventTerm2';
    payload: TermAttribute;
  }>
) {
  const { payload, type } = action.payload;
  if (type === 'eventTerm1') {
    const ruleType: RegulationTypes = yield select(selectCreateType);
    const steps = DEFINED_ATTRIBUTES[payload].steps as StepKey[];
    switch (ruleType) {
      case 'DEFAULT_RULE':
        if (type === 'eventTerm1') {
          yield put(actions.setSteps(steps));
          yield put(
            actions.setTimeTerm({
              type: 'timeTerm2',
              payload: { ...initialTimeTerm },
            })
          );
          yield put(
            actions.setEventTerm({ type: 'eventTerm2', payload: undefined })
          );
        }

        break;
      case 'EXCEPTION_RULE':
        yield put(actions.setSteps(steps));
        yield put(
          actions.setTimeTerm({
            type: 'timeTerm1',
            payload: { ...initialTimeTerm },
          })
        );
        break;

      default:
        break;
    }
  }
}

function* clear() {
  yield put(actions.resetState({ ...initialState }));
}

function* saveRule(action: PayloadAction<SaveRuleOption>) {
  const state: RegulationState = yield select(selectRegulationState);
  const commandText: CommandTextObject[] = yield select(selectCommandText);
  const auth: string = yield select(selectUserName);
  const key = uuid();

  const rule: RuleDto = {
    ruleType: state.createType,
    status: state.status,
    comment: state.comment,
    name: createRuleName(state.createType, state.timeTerm1, state.dummyName),
    description: commandText.map((o) => o.text).join(' '),
    raFsReferens: state.raFsReferens,
    gallringsgrund: state.gallringsgrund,
    atgard: state.atgard,
    terms:
      state.createType === 'TEXT_RULE'
        ? undefined
        : createTerm(
            state.timeTerm1,
            state.eventTerm1 as TermDto['attribute'],
            state.timeTerm2,
            state.eventTerm2 as TermDto['attribute']
          ),
  };

  try {
    switch (action.payload) {
      case 'add':
        yield put(actions.addToRuleList(rule));

        yield RuleControllerService.add({
          ...RestHeaders.post,
          requestBody: rule,
          auth,
        });
        yield put(
          appActions.setResponse({
            type: 'success',
            message: 'Skapade ny regel',
            key,
          })
        );
        yield clear();
        break;
      case 'add_faststall': {
        yield put(actions.addToRuleList(rule));
        const savedRule: RuleDto = yield RuleControllerService.add({
          ...RestHeaders.post,
          requestBody: rule,
          auth,
        });
        if (savedRule && savedRule.id) {
          yield RuleControllerService.establish({
            ...RestHeaders.get,
            id: savedRule.id,
            auth,
          });
          yield put(
            appActions.setResponse({
              type: 'success',
              message: 'Skapade och fastställde regel',
              key,
            })
          );
        }
        yield clear();
        break;
      }
      case 'update':
        if (state.id) {
          if (rule.id) yield put(actions.removeFromRuleList(rule.id));
          yield put(actions.addToRuleList(rule));
          const updatedRule: RuleDto = {
            ...rule,
            id: state.id,
            terms: rule.terms
              ? rule.terms.map((t, i) => ({
                  ...t,
                  id: i === 0 ? state.term1_id : state.term2_id,
                }))
              : undefined,
          };
          yield RuleControllerService.update({
            ...RestHeaders.post,
            requestBody: updatedRule,
            auth,
          });
          if (rule.status === 'faststalld') {
            yield RuleControllerService.establish({
              ...RestHeaders.post,
              id: state.id,
              auth,
            });
          }

          yield put(
            appActions.setResponse({
              type: 'success',
              message: 'Uppdaterade regel',
              key,
            })
          );
          yield clear();
        }
        break;
      default:
        break;
    }
    yield fetchRuleList();
  } catch (e: any) {
    console.log(e);
    yield clear();
    yield put(
      appActions.setResponse({
        type: 'error',
        message: `${e.body || e}`,
        key,
      })
    );
  }
}

function* getRule(action: PayloadAction<string>) {
  const key = uuid();
  try {
    const id = parseInt(action.payload, 10);
    const auth: string = yield select(selectUserName);
    const rule: RuleDto = yield RuleControllerService.get({
      ...RestHeaders.get,
      id,
      auth,
    });
    yield put(actions.setSelectedRule(rule));
  } catch (e: any) {
    console.log(e);
    yield put(
      appActions.setResponse({
        type: 'error',
        message: `${e.body || e}`,
        key,
      })
    );
  }
}

function* establishRule(action: PayloadAction<number>) {
  const key = uuid();
  try {
    const auth: string = yield select(selectUserName);
    yield RuleControllerService.establish({
      ...RestHeaders.get,
      id: action.payload,
      auth,
    });
    yield fetchRuleList();
    yield put(
      appActions.setResponse({
        type: 'success',
        message: 'Fastställde regel.',
        key,
      })
    );
  } catch (e: any) {
    console.log(e);
    yield put(
      appActions.setResponse({
        type: 'error',
        message: `${e.body || e}`,
        key,
      })
    );
  }
}

function* deleteRule(action: PayloadAction<number>) {
  const key = uuid();
  try {
    const id = action.payload;
    yield put(actions.removeFromRuleList(id));
    const auth: string = yield select(selectUserName);
    yield RuleControllerService.delete({
      ...RestHeaders.get,
      id,
      auth,
    });
    // yield fetchRuleList();
    yield put(
      appActions.setResponse({
        type: 'success',
        message: 'Raderade regel.',
        key,
      })
    );
  } catch (e: any) {
    console.log(e);
    yield put(
      appActions.setResponse({
        type: 'error',
        message: `${e.body || e}`,
        key,
      })
    );
  }
}

function* fetchRuleList() {
  const key = uuid();
  try {
    const auth: string = yield select(selectUserName);
    const rulelist: RuleDto[] = yield call(
      RuleControllerService.fetchAllRules,
      { ...RestHeaders.get, auth }
    );
    yield put(actions.setRuleList(rulelist));
  } catch (e: any) {
    console.log(e);
    yield put(
      appActions.setResponse({
        type: 'error',
        message: `${e.body || e}`,
        key,
      })
    );
  }
}

//====== INIT ====== //
export function* initData(): Generator<any, void, unknown> {
  yield all([
    takeLatest(actions.setCreateType.type, createTypeChange),
    takeLatest(actions.setEventTerm.type, eventTermChange),
    takeLatest(actions.openDialog.type, clear),
    takeLatest(actions.saveRule.type, saveRule),
    takeLatest(actions.getRule.type, getRule),
    takeLatest(actions.deleteRule.type, deleteRule),
    takeLatest(actions.establishRule.type, establishRule),
    takeLatest(actions.fetchRuleList.type, fetchRuleList),
  ]);
}
