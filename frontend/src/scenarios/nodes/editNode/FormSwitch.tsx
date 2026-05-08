/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonNode, NodeName } from 'Models/typed';
import React from 'react';
import EditDocumentNode from 'Scenarios/nodes/documentNode/EditDocumentNode';
import EditIssueNode from 'Scenarios/nodes/issueNode/EditIssueNode';
import EditKsNode from 'Scenarios/nodes/ksNode/EditKsNode';
import EditOperationalAreaNode from 'Scenarios/nodes/oaNode/EditOperationalAreaNode';
import EditPG from 'Scenarios/nodes/pgNode/EditPGNode';
import EditProcess from 'Scenarios/nodes/processNode/EditProcessNode';

interface FormSwitchProps {
  data: any;
  originalData?: CommonNode;
  onChangeHandler: (key: string, value: any, validators?: any) => void;
  disabled: boolean;
  nodeName: NodeName;
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  data,
  originalData,
  onChangeHandler,
  disabled,
  nodeName,
}) => {
  const props = {
    data,
    originalData,
    onChangeHandler,
    disabled,
  };
  switch (nodeName) {
    case 'csnode':
      return <EditKsNode {...props} />;
    case 'oanode':
      return <EditOperationalAreaNode {...props} />;
    case 'pgnode':
      return <EditPG {...props} />;
    case 'processnode':
      return <EditProcess {...props} />;
    case 'issuenode':
      return <EditIssueNode {...props} />;
    case 'documentnode':
      return <EditDocumentNode {...props} />;
    default:
      break;
  }

  return <></>;
};
export default FormSwitch;
