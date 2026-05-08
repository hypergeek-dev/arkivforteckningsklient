// functionality
import { isKS } from 'Common/helper';
import { Validator, validate } from 'Common/validators';
import RestHeaders from 'Services/RestHeaders';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// actions
import { actions } from 'Store/ducks/app/reducer';

// selectors
import {
  selectEditCompare,
  selectEditNode,
  selectErrors,
  selectHistoryArray,
  selectOpenEdit,
  selectSelectedHistory,
  selectLoading,
} from 'Store/ducks/app/selectors';
import {
  selectAuthUser,
  selectThemeSelected,
  selectUserName,
} from 'Store/ducks/user/selectors';

// types
import { NodeCommentControllerService, NodeTypeCommentDto } from 'Models/index';
import { CommonNode } from 'Models/typed';

// components
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Button, ButtonGroup } from '@mui/material';
import EditDialog from 'Scenarios/components/dialogs/EditDialog';
import CompareView from '../../components/compareview/CompareView';
import CommentDrawer from './CommentDrawer';
import FormSwitch from './FormSwitch';
import SaveButton from './SaveButton';
import StatusIndicatorStepper from './StatusIndicatorStepper';
import Loader from '../../../App/components/Loader';

const EditNode: React.FC = () => {
  const editNode = useAppSelector(selectEditNode);
  const history = useAppSelector(selectHistoryArray);
  const selectedHistory = useAppSelector(selectSelectedHistory);
  const formErrors = useAppSelector(selectErrors);
  const editORCompareView = useAppSelector(selectEditCompare);
  const authorized = useAppSelector(selectAuthUser);
  const auth = useAppSelector(selectUserName);
  const open = useAppSelector(selectOpenEdit);
  const loading = useAppSelector(selectLoading);

  const dispatch = useAppDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [original, setOriginal] = useState<CommonNode>();
  const [disabled, setDisabled] = useState(false);

  const [comments, setComments] = useState<NodeTypeCommentDto[]>([]);
  const [comment, setComment] = useState<string>('');

  function openDialog(command: 'OPEN' | 'CLOSE') {
    if (command === 'CLOSE') dispatch(actions.setEditCompare('EDIT'));
    setComment('');
    dispatch(actions.setOpenEdit(command));
    dispatch(actions.clearErrors());
  }

  const onChangeHandler = (
    key: string,
    value: string,
    validators: Validator[]
  ) => {
    if (editNode) {
      handleSetData(key, value);
      handleValidation(key, value, validators);
    }
  };

  const handleSetData = (key: string, value: string) => {
    if (
      key === 'relationComment' &&
      editNode &&
      (editNode.nodeName === 'issuenode' ||
        editNode.nodeName === 'processnode' ||
        editNode.nodeName === 'pgnode')
    ) {
      if (editNode.relations) {
        const relations = editNode.relations.map((r) => ({
          ...r,
          comment: value,
        }));
        dispatch(actions.setEditNode({ ...editNode, relations }));
      }
    } else if (editNode) {
      dispatch(actions.setEditNode({ ...editNode, [key]: value }));
    }
  };

  const handleValidation = (
    key: string,
    value: string,
    validators: Validator[]
  ) => {
    if (validators) {
      const error = validate(value, validators);
      if (error !== null) {
        dispatch(actions.setErrors({ ...formErrors, [key]: error }));
      } else {
        dispatch(actions.removeError(key));
      }
    }
  };

  function setFormData() {
    if (editNode) {
      setOriginal(editNode);
      if (isKS(editNode.nodeName)) {
        if (!authorized) {
          setDisabled(true);
        } else {
          setDisabled(editNode.status !== 'utkast');
        }
      } else {
        setDisabled(editNode.status !== 'utkast');
      }
    }
  }

  useEffect(() => {
    if (editNode) {
      setFormData();
    }
  }, [open]);

  useEffect(() => {
    if (editNode) {
      setFormData();
    }
  }, [editNode?.status]);

  /**
   *  COMMENT STUFF
   */

  useEffect(() => {
    if (editNode?.id) {
      getComment(editNode.id);
    }
  }, [editNode?.id]);

  if (!editNode) {
    return null;
  }

  const resolveConfirmText = (node: CommonNode): string => {
    if (node?.nodeName !== 'csnode')
      return 'Ops, nånting verkar fel. Du borde inte få den här frågan.';
    // if time stamp krockar  return 'OBS! Tidigare fastställd klassificeringsstruktur avslutas när denna klassificeringsstruktur startar.'

    if (node?.status === 'godkand')
      return 'Ni ändrar nu status på hela klassificeringsstrukturen till fastställd. Vill ni fortsätta?';

    if (node?.status === 'faststalld')
      return 'Ni låser nu upp en fastställd klassificeringsstruktur. Är ni säker?';
    return 'Hej, hopp... ingen träff här.';
  };

  return (
    <EditDialog
      open={open === 'OPEN'}
      handleClose={() => openDialog('CLOSE')}
      confirmText={resolveConfirmText(editNode)}
      confirmAction={confirmAction}
      openConfirm={openConfirm}
      setOpenConfirm={setOpenConfirm}
      actionButton={
        <SaveButton
          originalData={original}
          data={editNode}
          savedStatus={editNode.status}
          openDialog={openDialog}
        />
      }
      middleContent={<EditCompareButtons />}
      endContent={
        <StatusIndicatorStepper
          status={editNode.status}
          authorized={authorized}
          node={editNode}
          setOpenConfirm={setOpenConfirm}
        />
      }
    >
      {editORCompareView === 'COMPARE' ? (
        <CompareView
          node={editNode}
          history={history.filter((h) => h.updated !== editNode.updated)}
          selectedHistory={selectedHistory}
          handleChange={(e) => {
            const dateSelected = e.target.value;
            dispatch(actions.setSelectedHistory({ date: dateSelected }));
          }}
        />
      ) : (
        <FormSwitch
          data={editNode}
          originalData={original}
          onChangeHandler={onChangeHandler}
          disabled={disabled || editNode.status !== 'utkast'}
          nodeName={editNode.nodeName}
        />
      )}

      <CommentDrawer
        comment={comment}
        comments={comments}
        send={sendComment}
        setComment={setComment}
      />
      <Loader open={loading} />
    </EditDialog>
  );

  /**
   *  FUNCTIONS
   */
  function confirmAction(): void {
    if (editNode?.id) {
      openDialog('CLOSE');
      if (editNode.status === 'godkand') {
        dispatch(
          actions.establishNode({
            id: editNode.id,
            nodeName: editNode.nodeName,
          })
        );
      }
      // if ksnode is set to utkast -> set all children status to godkand
      if (editNode.status === 'faststalld') {
        dispatch(
          actions.draftNode({
            id: editNode.id,
            nodeName: editNode.nodeName,
          })
        );
      }
    }
    setOpenConfirm(false);
  }

  async function getComment(id: string) {
    const params = { ...RestHeaders.get, auth };
    const c = await NodeCommentControllerService.getComments({
      ...params,
      nodeId: parseInt(id, 10),
    });
    const sorted = [...c].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return -1;
    });
    setComments(sorted);
  }

  async function sendComment(c: string) {
    if (editNode) {
      const params = { ...RestHeaders.get, auth };
      const nodeComment: NodeTypeCommentDto = {
        comment: c,
        nodeId: parseInt(editNode.id, 10),
      };
      await NodeCommentControllerService.add2({
        ...params,
        requestBody: nodeComment,
      });
      setComment('');
      await getComment(editNode.id);
    }
  }
};

export default EditNode;

/**
 *
 *        COMPONENTS
 *
 */
const EditCompareButtons = () => {
  const theme = useAppSelector(selectThemeSelected);
  const editORCompareView = useAppSelector(selectEditCompare);
  const dispatch = useDispatch();

  const defaultStyle = {
    backgroundColor: '#cecece',
    color: 'rgba(0,0,0,0.6)',
    borderColor: 'rgba(0,0,0, 0.07)',
  };

  const notChosenStyle =
    theme === 'dark'
      ? { ...defaultStyle, filter: 'invert(90%)' }
      : defaultStyle;

  return (
    <ButtonGroup
      color="primary"
      size="small"
      aria-label="outlined button group"
    >
      <Button
        title="Jämför med äldreversioner"
        sx={editORCompareView !== 'COMPARE' ? notChosenStyle : {}}
        onClick={() => dispatch(actions.setEditCompare('COMPARE'))}
      >
        <HistoryIcon />
      </Button>
      <Button
        title="Visa/Redigera"
        sx={editORCompareView !== 'EDIT' ? notChosenStyle : {}}
        onClick={() => dispatch(actions.setEditCompare('EDIT'))}
      >
        <EditIcon />
      </Button>
    </ButtonGroup>
  );
};
