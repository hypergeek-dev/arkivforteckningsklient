/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  AlertTitle,
  Box,
  Grid2,
  Stack,
  Typography,
} from '@mui/material';
import { CHILDREN_NOT_READY, FORM_ERROR } from 'Common/constants';
import { requireMaxLength, requiredField } from 'Common/validators';
import {
  DocumentTypeNodeDto,
  IssueTypeNodeDto,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
} from 'Models/index';
import { CommonNode, NodeName } from 'Models/typed';
import NodetypeIcon from 'Scenarios/components/NodetypeIcon';
import { DocumentTypesDialog } from 'Scenarios/elements/components/SelectListElements';
import { CARD_HEIGHT, CARD_WIDTH } from 'Scenarios/nodes/ksNode/EditKsNode';
import { selectErrors } from 'Store/ducks/app/selectors';
import { structureNodes } from 'Store/ducks/data/selectors';
import {
  selectDocumentType,
  selectDocumentTypeForNode,
  selectEstablishedDocumentTypes,
} from 'Store/ducks/elements/selectors';
import { useAppSelector } from 'Store/hooks';
import React, { useState } from 'react';
import FormCard from './FormCard';
import { StyledInputForm } from './InputForm';
import SelectFormCardContent from './SelectForm';

type Props = {
  children?: JSX.Element[];
  node: CommonNode;
  disabled?: boolean;
  header: string;
  onChange: (key: string, value: any, validators?: any) => void;
};

const DefaultFormLayout: React.FC<Props> = ({
  node,
  children,
  disabled,
  onChange,
  header,
}) => {
  // for some reason paper becomes 2px larger than the card.
  const CONTAINER_WIDTH = 3 * (CARD_WIDTH + 2) + 2 * 16;
  const nameMaxLength = node.nodeName === 'csnode' ? 50 : 300;
  const error = useAppSelector(selectErrors);
  const data = useAppSelector(structureNodes);
  const elements = useAppSelector(selectEstablishedDocumentTypes);
  const docType = useAppSelector(selectDocumentType);
  const documentType = useAppSelector((state) =>
    selectDocumentTypeForNode(state, node)
  );
  const [openDocumenttypeDialog, setOpenDocumenttypeDialog] = useState(false);

  function getType(nodename: NodeName) {
    let result = '';
    switch (nodename) {
      case 'csnode':
        result = ' Arkivförteckning';

        break;
      case 'oanode':
        result = ' Arkivbildare';

        break;
      case 'pgnode':
        result = ' Arkiv';

        break;
      case 'processnode':
        result = ' Serie';

        break;
      case 'issuenode':
        result = ' Underserie';

        break;
      case 'documentnode':
        result = ' Volym';

        break;
      default:
        break;
    }
    return result;
  }

  function issueNodePath(node: IssueTypeNodeDto): string {
    const parent = data.find((n) => n.id === node.parentId);
    return parent?.path?.substring(parent.path.lastIndexOf('/') + 1) ?? '';
  }

  function documentNodePath(node: DocumentTypeNodeDto): string {
    const parent = data.find((n) => n.id === node.parentId);
    const splitPath = parent?.path?.split('/');
    if (splitPath) return splitPath[splitPath?.length - 2] + '';
    return '';
  }

  function processNodePath(
    node: ProcessGroupTypeNodeDto | ProcessTypeNodeDto
  ): string {
    const parent = data.find((n) => n.id === node.parentId);
    const children = data.filter(
      (n) => n.nodeName !== 'csnode' && n.parentId === parent?.id
    );
    const splitPath =
      parent?.path?.substring(parent.path.lastIndexOf('/') + 1) ?? '';
    if (splitPath && node.id === '-1')
      return splitPath + '.' + (children.length + 1);
    return node.localPath;
  }

  function nodePath(node: CommonNode): string {
    if (node.nodeName === 'issuenode')
      return issueNodePath(node) + getType(node.nodeName);
    if (node.nodeName === 'documentnode') {
      return `${documentNodePath(node)} ${getType(node.nodeName)}`;
    }

    if (node.nodeName === 'processnode' || node.nodeName === 'pgnode')
      return processNodePath(node) + getType(node.nodeName);

    const returnPath =
      node.path?.substring(node.path.lastIndexOf('/') + 1) ??
      'Ojdå, jag kan inte hitta vägen hit.';

    return returnPath + getType(node.nodeName);
  }

  return (
    <>
      {error && (error[CHILDREN_NOT_READY] || error[FORM_ERROR]) && (
        <Box sx={{ margin: '1rem auto 0' }}>
          <Alert severity="error">
            <AlertTitle>Kan inte ändra status</AlertTitle>
            {error[CHILDREN_NOT_READY] || error[FORM_ERROR]}
          </Alert>
        </Box>
      )}
      <div
        style={{
          margin: '0 auto',
          padding: '0',
          width: `${CONTAINER_WIDTH}px`,
        }}
      >
        <Grid2
          container
          columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
          spacing={2}
          sx={{ paddingBottom: 10, marginTop: '1rem' }}
        >
          <FormCard
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              justifyContent: 'space-between',
            }}
          >
            <Stack direction={'row'} alignItems={'center'}>
              <NodetypeIcon size="medium" nodeName={node.nodeName} />
              <Stack>
                <Typography ml={1} variant="h4">
                  {nodePath(node) || ''}
                </Typography>
              </Stack>
            </Stack>

            {node.nodeName === 'documentnode' && (
              <SelectFormCardContent
                sx={{ border: documentType ? 'none' : '2px solid red' }}
                key={`doctype-select-${documentType?.id}`}
                displayEmpty
                open={false}
                required
                renderValue={(v) => {
                  if (!v) {
                    return <em>Välj en dokumentyp (klar blir möjligt)*</em>;
                  }
                  return 'Dokumenttyp: ' + documentType?.name;
                }}
                disabled={disabled}
                onOpen={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!disabled) {
                    setOpenDocumenttypeDialog(true);
                  }
                }}
                value={documentType ? documentType.id : undefined}
                menuItems={elements
                  .filter((elm) => elm.datatype === docType?.id)
                  .map((elm) => ({ value: elm.id, label: elm.name }))}
                label="Dokumenttyp"
                validators={[requiredField()]}
              />
            )}

            <StyledInputForm
              onChangeHandler={onChange}
              value={node.name || ''}
              name="name"
              title={header}
              disabled={disabled}
              required
              multiline
              rows={3}
              maxLength={nameMaxLength}
              validators={[requireMaxLength(nameMaxLength), requiredField()]}
              sx={{ justifySelf: 'flex-end' }}
            />
          </FormCard>

          {children}
        </Grid2>
        {node.nodeName === 'documentnode' && (
          <DocumentTypesDialog
            open={openDocumenttypeDialog}
            setOpen={setOpenDocumenttypeDialog}
            nodeName="documentnode"
            id={node.id}
            disabled={false}
          />
        )}
      </div>
    </>
  );
};

export default DefaultFormLayout;
