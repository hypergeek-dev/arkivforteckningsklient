import { LabelImportantOutlined } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import { ElementDto } from 'Models/index';
import { NodeName } from 'Models/typed';
import SearchInput from 'Scenarios/components/SearchInput';
import StandardDialog from 'Scenarios/components/StandardDialog';
import { actions } from 'Store/ducks/elements';
import {
  selectDatatypes,
  selectEstablishedDocumentTypes,
  selectEstablishedElementListForNodeType,
  selectedElementsForNode,
} from 'Store/ducks/elements/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';
import ElementListItem from './ElementListItem';

type SelectListElementsProps = {
  selectedElements: ElementDto[];
  elements: ElementDto[];
  nodeName?: NodeName;
  setOpen?: (val: boolean) => void;
};

const SelectListDocumentTypes: React.FC<SelectListElementsProps> = ({
  selectedElements,
  elements,
  setOpen,
}) => {
  const dataTypes = useAppSelector(selectDatatypes);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');

  const docType = dataTypes.find((d) => d.type === 'DOCUMENT_TYPE');

  const handleRadio = (value: number) => () => {
    const egnaElement = selectedElements.filter(
      (elm) => elm.datatype !== docType?.id
    );
    const currentElement = elements.find((e) => e.id === value);
    if (currentElement) {
      dispatch(
        actions.setSelectedElementForNode([...egnaElement, currentElement])
      );
      if (setOpen) setOpen(false);
    }
  };

  const filterSearch = (name: string) => {
    if (searchValue.length === 0) return true;
    return name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
  };

  return (
    <Stack
      sx={{
        width: '100%',
        padding: '1rem 0',
      }}
      spacing={1}
    >
      <Typography sx={{ textAlign: 'center' }} variant="h2">
        Utöka handlingstypen
      </Typography>
      {selectedElements.filter((e) => e.datatype === docType?.id).length >
        0 && (
        <Typography sx={{ textAlign: 'center' }} variant="h4">
          Vald handlingstyp
        </Typography>
      )}

      <List sx={{ width: '100%' }}>
        {selectedElements
          .filter((elm) => docType?.id === elm.datatype)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((elm) => {
            const key = `element-${elm.id}`;
            if (!elm.id) return null;

            return (
              <ElementListItem
                key={`klsdsknfo${key}`}
                datatypes={dataTypes}
                element={elm}
                consumer
                style={{ width: '100%', background: '#c8e6c9' }}
              />
            );
          })}
      </List>

      <Typography sx={{ textAlign: 'center' }} variant="h4">
        Välj bland ({elements.length}) element
      </Typography>
      <Stack direction={'row'} justifyContent={'center'} width={1}>
        <SearchInput
          setValue={(v) => setSearchValue(v.trim().toLocaleLowerCase())}
          value={searchValue}
          hideFilter
          noToggle
        />
      </Stack>
      <List sx={{ width: '100%', height: '600px' }}>
        {elements
          .filter((elm) => docType?.id === elm.datatype)
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((elm) => {
            return filterSearch(elm.name);
          })
          .map((elm) => {
            const key = `element-${elm.id}`;
            if (!elm.id) return null;

            return (
              <ListItem dense key={key}>
                <ListItemButton
                  role={undefined}
                  onClick={handleRadio(elm.id)}
                  dense
                >
                  <ListItemIcon>
                    <Radio
                      checked={!!selectedElements.find((e) => e.id === elm.id)}
                    ></Radio>
                  </ListItemIcon>
                  <ElementListItem
                    key={`klsdsknfo${key}`}
                    datatypes={dataTypes}
                    element={elm}
                    consumer
                    style={{ width: '100%' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Stack>
  );
};
const SelectListElements: React.FC<SelectListElementsProps> = ({
  selectedElements,
  elements,
  nodeName,
}) => {
  const dataTypes = useAppSelector(selectDatatypes);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');

  const docType = dataTypes.find((d) => d.type === 'DOCUMENT_TYPE');

  const getLabel = () => {
    if (nodeName === 'documentnode') return 'handlingstypen';
    if (nodeName === 'issuenode') return 'ärendetypen';
    return '';
  };

  const handleToggle = (value: number) => () => {
    const currentElement = selectedElements.find((e) => e.id && e.id === value);

    if (currentElement) {
      dispatch(
        actions.setSelectedElementForNode(
          selectedElements.filter((e) => e.id !== currentElement.id)
        )
      );
    } else {
      const element = elements.find((e) => e.id === value);
      if (element)
        dispatch(
          actions.setSelectedElementForNode([...selectedElements, element])
        );
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        padding: '1rem 0',
      }}
      spacing={1}
    >
      <Typography sx={{ textAlign: 'center' }} variant="h2">
        Utöka {getLabel()}
      </Typography>
      {selectedElements.filter((e) => e.datatype !== docType?.id).length >
        0 && (
        <Typography sx={{ textAlign: 'center' }} variant="h4">
          Valda elementtyper
        </Typography>
      )}

      <List sx={{ width: '100%' }}>
        {selectedElements
          .filter((elm) => docType?.id !== elm.datatype)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((elm) => {
            const key = `element-${elm.id}`;
            const labelId = `elementLabel-${elm.id}`;
            if (!elm.id) return null;

            return (
              <ListItem sx={{ background: '#c8e6c9' }} dense key={key}>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(elm.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={!!selectedElements.find((e) => e.id === elm.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ElementListItem
                    key={`klsdsknfo${key}`}
                    datatypes={dataTypes}
                    element={elm}
                    consumer
                    style={{ width: '100%' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        Välj bland (
        {
          elements
            .filter((elm) => elm.datatype !== docType?.id)
            .filter((elm) => !selectedElements.find((e) => e.id === elm.id))
            .length
        }
        ) element
      </Typography>
      <Stack direction={'row'} justifyContent={'center'} width={1}>
        <SearchInput
          setValue={(v) => setSearchValue(v)}
          value={searchValue}
          hideFilter
          noToggle
        />
      </Stack>
      <List sx={{ width: '100%', height: '600px' }}>
        {elements
          .filter((elm) => elm.datatype !== docType?.id)
          .filter((elm) => !selectedElements.find((e) => e.id === elm.id))
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((elm) => {
            if (searchValue.length === 0) return true;
            return elm.name.startsWith(searchValue);
          })
          .map((elm) => {
            const key = `element-${elm.id}`;
            const labelId = `elementLabel-${elm.id}`;

            if (!elm.id) return null;

            return (
              <ListItem dense key={key}>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(elm.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={!!selectedElements.find((e) => e.id === elm.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ElementListItem
                    key={`klsdsknfo${key}`}
                    datatypes={dataTypes}
                    element={elm}
                    consumer
                    style={{ width: '100%' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Stack>
  );
};

type SelectListElementsButton = {
  nodeName: NodeName;
  id: string;
  disabled: boolean;
};
export const SelectListElementsButton: React.FC<SelectListElementsButton> = ({
  nodeName,
  id,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const selectedElements = useAppSelector(selectedElementsForNode);
  const elements = useAppSelector((state) =>
    selectEstablishedElementListForNodeType(state, nodeName)
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.fetchConnections({ id: parseInt(id), nodeName }));
  }, [id]);

  return (
    <>
      <Button
        startIcon={<LabelImportantOutlined />}
        variant="outlined"
        disabled={disabled}
        onClick={() => {
          setOpen(true);
        }}
      >
        Hantera egna element
      </Button>
      <StandardDialog
        maxWidth={'md'}
        fullWidth
        open={open}
        handleClose={() => setOpen(false)}
      >
        <SelectListElements
          elements={elements}
          selectedElements={selectedElements}
          nodeName={nodeName}
        />
      </StandardDialog>
    </>
  );
};
interface DocumentTypesDialogProps extends SelectListElementsButton {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export const DocumentTypesDialog: React.FC<DocumentTypesDialogProps> = ({
  nodeName,
  id,
  open,
  setOpen,
}) => {
  const selectedElements = useAppSelector(selectedElementsForNode);
  const elements = useAppSelector((state) =>
    selectEstablishedDocumentTypes(state)
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.fetchConnections({ id: parseInt(id), nodeName }));
  }, [id]);

  return (
    <StandardDialog
      maxWidth={'md'}
      fullWidth
      open={open}
      handleClose={() => setOpen(false)}
    >
      <SelectListDocumentTypes
        elements={elements}
        selectedElements={selectedElements}
        nodeName={nodeName}
        setOpen={setOpen}
      />
    </StandardDialog>
  );
};
