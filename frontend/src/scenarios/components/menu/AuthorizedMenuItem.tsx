import { isIHP, isKS, ksHasEnded } from 'Common/helper';
import { ClassificationStructureTypeNodeDto } from 'Models/index';
import { NodeName, Status } from 'Models/typed';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';

type MenuAction =
  | 'CREATE'
  | 'VIEW'
  | 'COPY'
  | 'DELETE'
  | 'DRAFT'
  | 'EXPORT'
  | 'IMPORT';
interface AuthorizedMenuItemProps {
  nodeName: NodeName;
  component: JSX.Element;
  menuAction: MenuAction;
  ks: ClassificationStructureTypeNodeDto;
  nodeStatus: Status;
}
const ksChangeable = (
  nodeName: NodeName,
  ks: ClassificationStructureTypeNodeDto
) => {
  if (isKS(nodeName)) {
    return ks.status !== 'faststalld';
  }

  if (isIHP(nodeName)) {
    return true;
  }
};

export const AuthorizedMenuItem: React.FC<AuthorizedMenuItemProps> = ({
  ks,
  nodeName,
  component,
  menuAction,
  nodeStatus,
}) => {
  const auth = useAppSelector(selectAuthUser);
  const location = useLocation();
  const ksEnded = ksHasEnded(ks);

  const handleCreate = () => {
    if (
      ksEnded ||
      (isKS(nodeName) && !auth) ||
      (isKS(nodeName) && (nodeStatus !== 'utkast' || ks.status !== 'utkast'))
    ) {
      return null;
    }
    if (nodeName === 'processnode') {
      return component;
    }
    return component;
  };

  const handleCopy = () => {
    if (ksEnded || (isKS(nodeName) && !auth)) {
      return null;
    }
    if (nodeName === 'processnode') {
      return component;
    }
    if (
      (nodeName === 'oanode' || nodeName === 'pgnode') &&
      (nodeStatus !== 'utkast' || ks.status !== 'utkast')
    ) {
      return null;
    }
    return component;
  };

  const handleDelete = () => {
    if (
      ksEnded ||
      (isKS(nodeName) && ks.status !== 'utkast') ||
      (isKS(nodeName) && !auth) ||
      !ksChangeable(nodeName, ks)
    ) {
      return null;
    }
    return component;
  };

  const handleDraft = () => {
    if (!auth || ksEnded) {
      return null;
    }
    if (auth && isKS(nodeName) && nodeStatus === 'faststalld') {
      if (nodeName === 'csnode') {
        return component;
      }
      return null;
    }
    return component;
  };

  const handleImport = () => {
    if (ksEnded) {
      return null;
    }
    if (auth && nodeName === 'csnode' && location.pathname.includes('tree')) {
      return component;
    }
    return null;
  };

  const handleExport = () => {
    if (
      auth &&
      (nodeName === 'issuenode' || nodeName === 'processnode') &&
      location.pathname.includes('tree')
    ) {
      return component;
    }
    return null;
  };

  switch (menuAction) {
    case 'CREATE':
      return handleCreate();
    case 'COPY':
      return handleCopy();
    case 'DELETE':
      return handleDelete();
    case 'VIEW':
      return component;
    case 'DRAFT':
      return handleDraft();
    case 'IMPORT':
      return handleImport();
    case 'EXPORT':
      return handleExport();
    default:
      return null;
  }
};
