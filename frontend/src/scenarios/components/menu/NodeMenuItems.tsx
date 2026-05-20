import {
  AccountTreeOutlined,
  AddOutlined,
  CopyAll as Copy,
  Delete,
  Edit,
  LockOpenOutlined,
  PictureAsPdf,
  UploadFile,
} from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { NodeName, Status } from 'Models/typed';
import { actions } from 'Store/ducks/app/reducer';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';
import { useState } from 'react';
import ImportDialog from '../dialogs/ImportDialog';

import { nodeTypeMapper } from 'Common/helper';
import { ClassificationStructureTypeNodeDto } from 'Models/index';
import { selectors as dataSelectors } from 'Store/ducks/data';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { AuthorizedMenuItem } from './AuthorizedMenuItem';

interface Props {
  nodeName: NodeName;
  ksId: string;
  id: string;
  status: Status;
  handleClose: () => void;
  setOpenConfirm: (o: boolean) => void;
}

const NodeMenuItems: React.FC<Props> = ({
  ksId,
  nodeName,
  id,
  status,
  handleClose,
  setOpenConfirm,
}) => {
  const authorized = useAppSelector(selectAuthUser);
  const [importOpen, setImportOpen] = useState(false);

  const activeEstablishedKS = useAppSelector(
    dataSelectors.selectActiveEstablishedKsId
  );
  const ks = useAppSelector(
    dataSelectors.selectChosenKS
  ) as ClassificationStructureTypeNodeDto;
  const dispatch = useAppDispatch();
  const disabled =
    (nodeName === 'csnode' || nodeName === 'oanode') && !authorized;
  const mapped = nodeTypeMapper(nodeName);

  if (!ks) {
    return null;
  }
  return (
    <>
      <MenuItem
        tabIndex={1}
        title="Redigera/visa denna nod."
        aria-label="JämförelseVyn"
        onClick={() => {
          dispatch(actions.setEditCompare('EDIT'));
          dispatch(actions.fetchEditNode({ id, nodeName }));
          handleClose();
        }}
      >
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Öppna</ListItemText>
      </MenuItem>
      {authorized && (
        <MenuItem
          aria-label="IHP rapport"
          onClick={() => {
            handleClose();
            dispatch(actions.openIHPReport({ id: ksId, nodeName, nodeId: id }));
          }}
        >
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rapport</ListItemText>
        </MenuItem>
      )}
      {nodeName !== 'documentnode' && (
        <AuthorizedMenuItem
          ks={ks}
          nodeName={nodeName}
          nodeStatus={status}
          menuAction="CREATE"
          component={
            <MenuItem
              aria-label={`Skapa ${mapped.label}`}
              title="Skapa ny"
              onClick={() => {
                dispatch(
                  actions.createEditDialog({
                    id,
                    nodeName,
                  })
                );
                handleClose();
              }}
            >
              <ListItemIcon>
                <AddOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>{`Skapa ${mapped.label}`}</ListItemText>
            </MenuItem>
          }
        />
      )}
      <AuthorizedMenuItem
        ks={ks}
        nodeName={nodeName}
        nodeStatus={status}
        menuAction="COPY"
        component={
          <MenuItem
            title="Kopiera objekt."
            aria-label="Kopiera objekt."
            disabled={disabled}
            onClick={() => {
              dispatch(
                actions.setCopyDialog({
                  title: 'Kopiera objekt',
                  text: 'Kopierar enbart det valda objektet, ej underliggande struktur.',
                  open: true,
                  id,
                  nodeName,
                  copyStruct: false,
                })
              );
            }}
          >
            <ListItemIcon>
              <Copy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Kopiera objekt</ListItemText>
          </MenuItem>
        }
      />
      <AuthorizedMenuItem
        ks={ks}
        nodeName={nodeName}
        nodeStatus={status}
        menuAction="COPY"
        component={
          <MenuItem
            title="Kopiera objekt och struktur."
            aria-label="Kopiera struktur"
            disabled={disabled}
            onClick={() => {
              dispatch(
                actions.setCopyDialog({
                  title: 'Kopiera objekt och struktur',
                  text: 'Kopierar det valda objektet och samtliga av dess undernoder.',
                  open: true,
                  id,
                  nodeName,
                  copyStruct: true,
                })
              );
            }}
          >
            <ListItemIcon>
              <AccountTreeOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Kopiera struktur</ListItemText>
          </MenuItem>
        }
      />
      {activeEstablishedKS === ks.id && nodeName === 'csnode' ? null : (
        <AuthorizedMenuItem
          ks={ks}
          nodeName={nodeName}
          nodeStatus={status}
          menuAction="DELETE"
          component={
            <MenuItem
              title="Det går bara att radera för status utkast."
              aria-label="radera"
              disabled={status !== 'utkast' || disabled}
              onClick={() => setOpenConfirm(true)}
            >
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Radera</ListItemText>
            </MenuItem>
          }
        />
      )}
      {status === 'faststalld' && (
        <AuthorizedMenuItem
          ks={ks}
          nodeName={nodeName}
          nodeStatus={status}
          menuAction="DRAFT"
          component={
            <MenuItem
              title="Byt status till utkast så det går att ändra på noden."
              aria-label="Lås upp till utkast"
              disabled={disabled}
              onClick={() => {
                dispatch(actions.draftNode({ id, nodeName }));
                handleClose();
              }}
            >
              <ListItemIcon>
                <LockOpenOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Lås upp till utkast</ListItemText>
            </MenuItem>
          }
        />
      )}
      <AuthorizedMenuItem
        ks={ks}
        nodeName={nodeName}
        nodeStatus={status}
        menuAction="IMPORT"
        component={
          <MenuItem
            aria-label="Importera arkivförteckning"
            title="Importera arkivförteckning från JSON-fil"
            onClick={() => {
              setImportOpen(true);
              handleClose();
            }}
          >
            <ListItemIcon>
              <UploadFile fontSize="small" />
            </ListItemIcon>
            <ListItemText>Importera arkivförteckning</ListItemText>
          </MenuItem>
        }
      />
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={() => setImportOpen(false)}
      />
    </>
  );
};
export default NodeMenuItems;
