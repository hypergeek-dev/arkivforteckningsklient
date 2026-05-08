/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage, nodeTypeMapper } from 'Common/helper';
import {
  ClassificationStructureNode,
  DocumentNode,
  IssueNode,
  OperationalAreaNode,
  ProcessGroupNode,
  ProcessNode,
} from 'Models/dataObjects';
import {
  ClassificationStructureControllerService,
  DocumentControllerService,
  DocumentTypeNodeDto,
  DroppedNodeDto,
  ElementDto,
  HistoryDto,
  IssueControllerService,
  IssueTypeNodeDto,
  MergeProcessDto,
  ModelControllerService,
  OpenAPI,
  OperationalAreaControllerService,
  ProcessControllerService,
  ProcessGroupControllerService,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
  RuleControllerService,
  RuleDto,
  TreeControllerService,
} from 'Models/index';
import {
  CommonNode,
  CopyAction,
  IDNodeNameAction,
  UpdateAction,
} from 'Models/typed';
import RestHeaders from 'Services/RestHeaders';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import { actions as treeActions } from '../IHPToolStructure';
import { actions as dataActions, selectors as dataSelectors } from '../data';
import { actions as elementAction } from '../elements';
import { selectUserName } from '../user/selectors';
import { actions } from './reducer';
import { selectEditNode } from './selectors';

const port = window.location.port;

if (port === '3000') {
  OpenAPI.BASE = 'http://localhost:3000';
} else {
  OpenAPI.BASE = '/ihpappbackend';
}
OpenAPI.HEADERS = RestHeaders.get;

function* addAndMergePG(
  action: PayloadAction<MergeProcessDto>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    yield call(ProcessGroupControllerService.addPgNodeAndmerge, {
      ...RestHeaders.get,
      auth,
      requestBody: action.payload,
    });
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'success',
        message: 'Uppdatering lyckades.',
      })
    );
    yield updateData();
  } catch (e: any) {
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e) })
    );
  }
}

function* deleteNode(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const { id, nodeName } = action.payload;
    const params = { ...RestHeaders.get, auth, id };
    const mapper = nodeTypeMapper(nodeName);

    switch (nodeName) {
      case 'csnode':
        yield call(
          ClassificationStructureControllerService.deleteCsNode,
          params
        );
        break;
      case 'documentnode':
        yield call(DocumentControllerService.deleteDocumentNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.deleteIssueNode, params);
        break;
      case 'oanode':
        yield call(OperationalAreaControllerService.deleteOaNode, params);
        break;
      case 'pgnode':
        yield call(ProcessGroupControllerService.deletePgNode, params);
        break;
      case 'processnode':
        yield call(ProcessControllerService.deleteProcessNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }

    const key = uuid();
    yield put(actions.deleted(action.payload));
    if (nodeName === 'csnode') {
      yield put(
        actions.setResponse({
          type: 'info',
          message: `${mapper.name} raderades`,
          key,
        })
      );
    } else {
      yield put(
        dataActions.removeStructureNode(parseInt(action.payload.id, 10))
      );
      yield put(
        actions.setResponse({
          type: 'success',
          message: `${mapper.name} ${id} raderades.`,
          key,
        })
      );
    }
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* establish(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const { id, nodeName } = action.payload;
    const params = { ...RestHeaders.get, auth, id };
    yield put(actions.setLoading(true));
    switch (nodeName) {
      case 'csnode':
        yield call(
          ClassificationStructureControllerService.establishCsNode,
          params
        );
        yield put(dataActions.clearStructureNodes());
        yield put(dataActions.loadKsDataById(id));
        yield fetchAllKS();
        break;
      case 'documentnode':
        yield call(DocumentControllerService.establishDocumentNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.establishIssueNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }
    yield updateData();
    const data = yield select(selectEditNode);
    yield put(actions.setEditNode({ ...data, status: 'faststalld' }));
    const key = uuid();
    yield put(
      actions.setResponse({
        type: 'success',
        message: `Nod fick status fastställd.`,
        key,
      })
    );
    yield put(actions.setLoading(false));
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* approve(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const { id, nodeName } = action.payload;
    const params = { ...RestHeaders.get, auth, id };
    switch (nodeName) {
      case 'csnode':
        yield call(
          ClassificationStructureControllerService.approveCsNode,
          params
        );
        yield fetchAllKS();
        break;
      case 'documentnode':
        yield call(DocumentControllerService.approveDocumentNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.approveIssueNode, params);
        break;
      case 'oanode':
        yield call(
          OperationalAreaControllerService.approveOperationalAreaNode,
          params
        );
        break;
      case 'pgnode':
        yield call(
          ProcessGroupControllerService.approveProcessGroupNode,
          params
        );
        break;
      case 'processnode':
        yield call(ProcessControllerService.approveProcessNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }
    yield updateData();
    const data = yield select(selectEditNode);
    yield put(actions.setEditNode({ ...data, status: 'godkand' }));
    const key = uuid();
    yield put(
      actions.setResponse({
        type: 'success',
        message: `Nod fick status godkänd.`,
        key,
      })
    );
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* draft(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);

    const { id, nodeName } = action.payload;
    const params = { ...RestHeaders.get, auth, id };
    const mapper = nodeTypeMapper(nodeName);

    switch (nodeName) {
      case 'csnode':
        yield call(
          ClassificationStructureControllerService.draftCsNode,
          params
        );
        yield put(dataActions.clearStructureNodes());
        yield put(dataActions.loadKsDataById(id));
        yield fetchAllKS();
        break;
      case 'documentnode':
        yield call(DocumentControllerService.draftDocumentNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.draftIssueNode, params);
        break;
      case 'oanode':
        yield call(
          OperationalAreaControllerService.draftOperationalAreaNode,
          params
        );
        break;
      case 'pgnode':
        yield call(ProcessGroupControllerService.draftProcessGroupNode, params);
        break;
      case 'processnode':
        yield call(ProcessControllerService.draftProcessNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }
    yield updateData();
    const data = yield select(selectEditNode);
    yield put(actions.setLoading(false));
    yield put(actions.setEditNode({ ...data, status: 'utkast' }));
    const key = uuid();
    yield put(
      actions.setResponse({
        type: 'success',
        message: `${mapper.name} upplåst till utkast`,
        key,
      })
    );
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* ready(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);

    const { id, nodeName } = action.payload;
    const params = { ...RestHeaders.get, auth, id };
    const mapper = nodeTypeMapper(nodeName);
    const data = yield select(selectEditNode);
    yield update({ payload: { data, nodeName }, type: '' });
    switch (nodeName) {
      case 'csnode':
        yield call(
          ClassificationStructureControllerService.readyCsNode,
          params
        );
        yield fetchAllKS();
        break;
      case 'documentnode':
        yield call(DocumentControllerService.readyDocumentNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.readyIssueNode, params);
        break;
      case 'oanode':
        yield call(
          OperationalAreaControllerService.readyOperationalAreaNode,
          params
        );
        break;
      case 'pgnode':
        yield call(ProcessGroupControllerService.readyProcessGroupNode, params);
        break;
      case 'processnode':
        yield call(ProcessControllerService.readyProcessNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }
    yield updateData();
    const key = uuid();
    yield put(actions.setEditNode({ ...data, status: 'klar' }));
    yield put(
      actions.setResponse({
        type: 'success',
        message: `${mapper.name} status satt till klar`,
        key,
      })
    );
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* copyNode(
  action: PayloadAction<CopyAction>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const { id, nodeName, copyStruct } = action.payload;
    const params = { ...RestHeaders.get, auth, id, copyStruct };
    switch (nodeName) {
      case 'csnode':
        yield call(ClassificationStructureControllerService.copyCsNode, params);
        yield fetchAllKS();
        break;
      case 'documentnode':
        yield call(DocumentControllerService.copyDocumentTypeNode, params);
        break;
      case 'issuenode':
        yield call(IssueControllerService.copyIssueNode, params);
        break;
      case 'oanode':
        yield call(OperationalAreaControllerService.copyOaNode, params);
        break;
      case 'pgnode':
        yield call(ProcessGroupControllerService.copyPgNode, params);
        break;
      case 'processnode':
        yield call(ProcessControllerService.copyProcessNode, params);
        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown nodeName: ' + nodeName,
          })
        );
        break;
    }
    yield updateData();
    const key = uuid();
    yield put(
      actions.setResponse({
        type: 'success',
        message: `Noden kopierades.`,
        key,
      })
    );
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* update(
  action: PayloadAction<UpdateAction>
): Generator<any, any, any> {
  try {
    const { nodeName, data } = action.payload;
    let updatedNode: CommonNode | undefined = undefined;
    const auth: string = yield select(selectUserName);

    switch (data.nodeName) {
      case 'csnode':
        updatedNode = yield call(
          ClassificationStructureControllerService.updateCsNode,
          {
            ...RestHeaders.get,
            auth,
            requestBody: data,
          }
        );
        yield fetchAllKS();
        break;
      case 'documentnode':
        updatedNode = yield call(DocumentControllerService.updateDocumentNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });
        break;
      case 'issuenode':
        updatedNode = yield call(IssueControllerService.updateIssueNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      case 'oanode':
        updatedNode = yield call(
          OperationalAreaControllerService.updateOaNode,
          {
            ...RestHeaders.get,
            auth,
            requestBody: data,
          }
        );

        break;
      case 'pgnode':
        updatedNode = yield call(ProcessGroupControllerService.updatePgNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      case 'processnode':
        updatedNode = yield call(ProcessControllerService.updateProcessNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      default:
        yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown node name: ' + nodeName,
          })
        );
        break;
    }
    if (updatedNode) {
      yield put(dataActions.updateNode(updatedNode));
      const key = uuid();
      yield put(
        actions.setResponse({
          type: 'success',
          message: `Uppdaterad!`,
          key,
        })
      );
    }
    //yield updateData();
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* create(
  action: PayloadAction<UpdateAction>
): Generator<any, any, any> {
  try {
    const { nodeName, data } = action.payload;
    let newNode: CommonNode | undefined = undefined;
    const auth: string = yield select(selectUserName);

    switch (data.nodeName) {
      case 'csnode': {
        const authName = 'Migrationsverket';
        const newData = { ...data, authName };
        yield call(ClassificationStructureControllerService.addCsNode, {
          ...RestHeaders.get,
          auth,
          requestBody: newData,
        });
        yield fetchAllKS();
        break;
      }

      case 'documentnode':
        newNode = yield call(DocumentControllerService.addDocumentNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      case 'issuenode':
        newNode = yield call(IssueControllerService.addErrandNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      case 'oanode':
        newNode = yield call(OperationalAreaControllerService.addAaNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });
        break;

      case 'pgnode':
        newNode = yield call(ProcessGroupControllerService.addPgNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      case 'processnode':
        newNode = yield call(ProcessControllerService.addProcessNode, {
          ...RestHeaders.get,
          auth,
          requestBody: data,
        });

        break;
      default:
        newNode = yield put(
          actions.setResponse({
            type: 'error',
            message: 'Unknown node name: ' + nodeName,
          })
        );
        break;
    }
    //yield updateData();
    if (newNode) {
      yield put(dataActions.addStructureNode(newNode));
    }
    const key = uuid();
    yield put(
      actions.setResponse({
        type: 'success',
        message: `Skapad!`,
        key,
      })
    );
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* fetchEditNode(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const auth = yield select(selectUserName);
    const { id } = action.payload;
    const params = {
      ...RestHeaders.get,
      auth,
      id,
    };

    const node: CommonNode = yield select(
      dataSelectors.nodeById,
      parseInt(id, 10)
    );

    if (node && node.nodeName === 'documentnode') {
      yield handleDocumentNode(node);
      yield put(elementAction.fetchElements());
    }

    if (node.uuid) {
      yield handleNodeHistory(params, node);
    }

    yield handleRelatedNodes(params, node);

    yield put(actions.setEditNode(node));
    yield put(actions.setOpenEdit('OPEN'));
  } catch (e: any) {
    const key = uuid();
    yield put(actions.setLoading(false));
    yield put(
      actions.setResponse({ type: 'error', message: getErrorMessage(e), key })
    );
  }
}

function* handleDocumentNode(node: DocumentTypeNodeDto) {
  yield put(actions.setOpenRegulationCard(false));
  yield fetchRegulationDefaultListByFilter();
  if (node.assignedRules && node.assignedRules.length !== 0) {
    yield put(actions.setOpenRegulationCard(true));
    const defaultRule = node.assignedRules.find(
      (r) => r.ruleType === 'DEFAULT_RULE'
    );
    if (defaultRule && node.assignedRules.length === 1) {
      yield fetchRegulationListByType({
        payload: 'EXCEPTION_RULE',
        type: '',
      });
    }
  }
}

function* handleNodeHistory(params: any, node: CommonNode) {
  const history: HistoryDto[] = yield call(ModelControllerService.getHistory, {
    ...params,
    uuid: node.uuid,
  });
  const parsedHistory: CommonNode[] = history.map((node) =>
    JSON.parse(node.jsonb)
  );
  const sortedHistory: CommonNode[] = [...parsedHistory]
    .filter((n) => n.updated !== node.updated)
    .sort((a, b) => {
      const aVal = a.updated ?? a.createdAt ?? '';
      const bVal = b.updated ?? b.createdAt ?? '';
      return bVal.localeCompare(aVal);
    });

  yield put(actions.setHistory(sortedHistory));
  if (sortedHistory.length > 0) {
    const date = sortedHistory[0].updated ?? sortedHistory[0].createdAt ?? '';
    yield put(actions.setSelectedHistory({ date }));
  }
}

function* handleRelatedNodes(params: any, node: CommonNode) {
  if (
    node.path &&
    (node.nodeName === 'pgnode' || node.nodeName === 'processnode')
  ) {
    const encodedPath = btoa(node.path);
    const relatedNodes: (ProcessGroupTypeNodeDto | ProcessTypeNodeDto)[] =
      yield call(ProcessGroupControllerService.fetchRelationNodesByOwner, {
        ...params,
        path: encodedPath,
      });

    yield put(actions.initRelationNodes(relatedNodes));
  }

  if (node.path && node.nodeName === 'issuenode') {
    const encodedPath = encodeURIComponent(node.path);
    const relatedNodes: IssueTypeNodeDto[] = yield call(
      IssueControllerService.fetchRelationNodesByOwnerPath,
      { ...params, path: encodedPath }
    );
    yield put(actions.initRelationNodes(relatedNodes));
  }
}

function* fetchRegulationDefaultListByFilter() {
  try {
    const auth: string = yield select(selectUserName);
    const list: RuleDto[] = yield call(RuleControllerService.fetchAllByFilter, {
      ...RestHeaders.get,
      auth,
      value: [[0, 100]],
    });
    yield put(
      actions.setRuleList(list.filter((r) => r.status === 'faststalld'))
    );
    yield put(actions.setRegulationFilter('alla'));
  } catch (e: any) {
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'error',
        message: `Misslyckades att hämta listan av regler ${e.body || e}`,
      })
    );
  }
}

function* fetchRegulationListByFilter(
  action: PayloadAction<number[][]>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const list: RuleDto[] = yield call(RuleControllerService.fetchAllByFilter, {
      ...RestHeaders.get,
      auth,
      value: action.payload,
    });
    yield put(
      actions.setRuleList(list.filter((r) => r.status === 'faststalld'))
    );
  } catch (e: any) {
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'error',
        message: `Misslyckades att hämta listan av regler ${e.body || e}`,
      })
    );
  }
}
function* fetchRegulationListByType(
  action: PayloadAction<'DEFAULT_RULE' | 'EXCEPTION_RULE' | 'TEXT_RULE'>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    const list: RuleDto[] = yield call(RuleControllerService.fetchAllByType, {
      ...RestHeaders.get,
      auth,
      ruleType: action.payload,
    });
    if (action.payload === 'EXCEPTION_RULE') {
      yield put(
        actions.setExceptionRuleList(
          list.filter((r) => r.status === 'faststalld')
        )
      );
    } else {
      yield put(
        actions.setRuleList(list.filter((r) => r.status === 'faststalld'))
      );
    }
  } catch (e: any) {
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'error',
        message: `Misslyckades att hämta listan av regler ${e.body || e}`,
      })
    );
  }
}

function* createEditDialog(
  action: PayloadAction<IDNodeNameAction>
): Generator<any, any, any> {
  try {
    const { id, nodeName } = action.payload;

    let data: CommonNode | undefined;
    switch (nodeName) {
      case 'csnode':
        if (id === 'csnode') {
          data = { ...ClassificationStructureNode };
        } else {
          data = { ...OperationalAreaNode, parentId: id };
        }
        break;
      case 'issuenode':
        data = { ...DocumentNode, parentId: id };
        break;
      case 'oanode':
        data = { ...ProcessGroupNode, parentId: id };
        break;
      case 'pgnode':
        data = { ...ProcessNode, parentId: id };
        break;
      case 'processnode':
        data = { ...IssueNode, parentId: id };
        break;

      default:
        break;
    }

    yield put(actions.setEditNode(data));
    yield put(actions.clearRelationNodes());
    yield put(actions.setOpenCreate('OPEN'));
  } catch (e: any) {
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'error',
        message: `Misslyckades skapa nod ${e.body || e}`,
      })
    );
  }
}

function* moveNode(
  action: PayloadAction<DroppedNodeDto>
): Generator<any, any, any> {
  try {
    const auth: string = yield select(selectUserName);
    yield call(TreeControllerService.moveNode, {
      ...RestHeaders.get,
      auth,
      requestBody: action.payload,
    });
    const key = uuid();
    const moved: CommonNode = yield select(
      dataSelectors.nodeById,
      action.payload.node.id
    );
    yield put(
      actions.setResponse({
        key,
        type: 'success',
        message: `Flyttade ${moved.name}`,
      })
    );
    yield updateData();
  } catch (e: any) {
    const key = uuid();
    yield put(
      actions.setResponse({
        key,
        type: 'error',
        message: `${e.body || e}`,
      })
    );
  }
}

function* updateData() {
  const ks: CommonNode = yield select(dataSelectors.selectChosenKS);
  if (ks) {
    yield put(treeActions.updateTreeData(parseInt(ks.id)));
  }
}
function* fetchAllKS() {
  yield put(dataActions.loadData());
}
function* initApp() {
  //yield fetchRegulationDefaultListByFilter();
}
function* takeLatestElementAction(action: PayloadAction<ElementDto[]>) {
  const data: IssueTypeNodeDto | DocumentTypeNodeDto =
    yield select(selectEditNode);
  yield put(actions.setEditNode({ ...data, assignedElements: action.payload }));
}
//====== INIT ====== //
export function* initData(): Generator<any, void, unknown> {
  yield all([
    initApp(),
    takeLatest(actions.moveNode.type, moveNode),
    takeLatest(actions.createEditDialog.type, createEditDialog),
    takeLatest(actions.establishNode.type, establish),
    takeLatest(actions.approveNode.type, approve),
    takeLatest(actions.readyNode.type, ready),
    takeLatest(actions.draftNode.type, draft),
    takeLatest(actions.updateNode.type, update),
    takeLatest(actions.createNode.type, create),
    takeLatest(actions.fetchEditNode.type, fetchEditNode),
    takeLatest(actions.deleteNode.type, deleteNode),
    takeLatest(actions.copyNode.type, copyNode),
    takeLatest(actions.addAndMergePG.type, addAndMergePG),
    takeLatest(actions.fetchByFilter.type, fetchRegulationListByFilter),
    takeLatest(actions.fetchByType.type, fetchRegulationListByType),
    takeLatest(
      actions.fetchDefaultRegulationList.type,
      fetchRegulationDefaultListByFilter
    ),
    takeLatest(
      elementAction.setSelectedElementForNode.type,
      takeLatestElementAction
    ),
  ]);
}
