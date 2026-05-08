import ClearIcon from '@mui/icons-material/Clear';
import { Box, Divider, Typography, Grid2 } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { PayloadAction } from '@reduxjs/toolkit';
import { getEnv } from 'Common/helper';
import { requireMaxLength } from 'Common/validators';
import {
  IssueTypeNodeDto,
  NodeRelationControllerService,
  OperationalAreaControllerService,
  OperationalAreaTypeNodeDto,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
  RelationCandidate,
} from 'Models/index';
import { CommonNode, NodeName } from 'Models/typed';
import ChipSelect from 'Scenarios/components/ChipSelect';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import RestHeaders from 'Services/RestHeaders';
import { actions } from 'Store/ducks/app';
import { selectRelationsNodes } from 'Store/ducks/app/selectors';
import { selectors as dataSelectors } from 'Store/ducks/data';
import { selectUserName } from 'Store/ducks/user/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';

type Props = {
  data: ProcessGroupTypeNodeDto | ProcessTypeNodeDto | IssueTypeNodeDto;
  onChangeHandler: (key: string, value: string | number | boolean) => void;
  disabled: boolean;
};

const RelationsCardContent: React.FC<Props> = ({
  data,
  disabled,
  onChangeHandler,
}) => {
  const treeData = useAppSelector(dataSelectors.selectTreeDataNodes);
  const currentKSID = useAppSelector(dataSelectors.selectChosenKS);
  const auth = useAppSelector(selectUserName);
  const [operationalAreas, setOperationalAreas] = useState<
    OperationalAreaTypeNodeDto[]
  >([]);
  const [selectedArea, setSelectedArea] = useState<string>();
  const [relationCandidates, setRelationCandidates] = useState<
    RelationCandidate[]
  >([]);

  const dispatch = useAppDispatch();
  const relationNodes = useAppSelector(selectRelationsNodes) ?? [];
  const relationComment =
    data.relations && data.relations.length !== 0
      ? data.relations[0].comment
      : '';

  // fetch on init
  useEffect(() => {
    if (currentKSID) {
      const fetchOA = async () => {
        const voNodes =
          await OperationalAreaControllerService.fetchAaNodesByParentId({
            ...RestHeaders.get,
            parentId: `${currentKSID.id}`,
            auth,
          });
        const sortedOA = [...voNodes].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );
        setOperationalAreas(sortedOA);
      };

      // check client data
      if (treeData.length !== 0) {
        const treeVos = treeData
          .map((n) => n.data as CommonNode)
          .filter(
            (n) => n.nodeName === 'oanode'
          ) as OperationalAreaTypeNodeDto[];
        setOperationalAreas(treeVos);
      } else {
        fetchOA();
      }
    }
  }, []);

  return (
    <>
      {!disabled && (
        <>
          <Grid2 container height="50%">
            <Grid2 size={{ xs: 7 }} paddingRight={2}>
              <Typography variant="h5" marginBottom={1}>
                {`Relation till ${resolveTitle(data.nodeName)}`}
              </Typography>
              <div
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  marginRight: '1em',
                }}
              >
                {relationCandidates
                  .filter((c) => c.id !== data.id)
                  .map((rc: RelationCandidate, idx: number) => {
                    const lastChild = idx + 1 === relationCandidates.length;
                    const isAdded = relationNodes.some(
                      (item: RelationCandidate) => {
                        return item.id === rc.id;
                      }
                    );
                    return (
                      <div
                        key={`relation-candidate-${rc.id}`}
                        style={{
                          paddingRight: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Checkbox
                          checked={isAdded}
                          onChange={() => {
                            if (isAdded && rc.path && rc.id) {
                              dispatch(actions.removeRelation(rc.path));
                              dispatch(actions.removeRelationNode(rc.id));
                              return;
                            }
                            dispatch(actions.setRelations(rc));
                            dispatch(actions.setRelationNodes(rc));
                          }}
                        />
                        <Box
                          sx={{
                            marginLeft: '0.25rem',
                            height: '100%',
                            paddingBlock: '0.5rem',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            position: 'relative',
                          }}
                        >
                          <Typography
                            key={`relation-candidate-name-${rc.id}`}
                            display={'inline-block'}
                            marginLeft="0.5rem"
                            letterSpacing="0.01rem"
                          >
                            {rc.fullName}
                          </Typography>
                          {!lastChild && (
                            <Divider
                              variant="fullWidth"
                              absolute
                              sx={{ bottom: 0 }}
                            />
                          )}
                        </Box>
                      </div>
                    );
                  })}
              </div>
            </Grid2>

            <Grid2
              size={{ xs: 5 }}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Typography variant="h5" marginBottom={1}>
                Filtrera på verksamhetsområde
              </Typography>
              <Grid2
                container
                rowGap={1}
                flexDirection="column"
                alignContent="flex-start"
                paddingBottom="0.75rem"
              >
                {operationalAreas.map((node, i) => (
                  <Grid2 key={`relation-filter-grid-item-${node.id}`}>
                    <ChipSelect
                      label={`${i + 1}. ${node.name}`}
                      key={`relation-filter-select-chip-${node.id}`}
                      active={selectedArea === node.id}
                      handleChipSelect={() =>
                        handleSelect(
                          node.id,
                          node.path ?? '',
                          data.nodeName,
                          auth
                        )
                      }
                      title={node.name}
                      variant="outlined"
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>
          </Grid2>

          <Divider />
        </>
      )}

      <Grid2 container marginTop={2} height="50%">
        <Grid2
          size={{ xs: 7 }}
          paddingRight={2}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="h5" marginBottom={1}>
            Valda relationer
          </Typography>
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #808080',
              borderRadius: '4px',
              marginRight: '1em',
            }}
          >
            {relationNodes?.map((rn: CommonNode | RelationCandidate) => (
              <ChosenRelation
                data={rn}
                disabled={disabled}
                dispatch={dispatch}
                key={`relation-node-${rn.id}`}
              />
            ))}
          </div>
        </Grid2>

        <Grid2 size={{ xs: 5 }}>
          <StyledInputForm
            name="relationComment"
            onChangeHandler={onChangeHandler}
            title="Kommentar till relationer"
            multiline
            rows={12}
            maxLength={400}
            value={relationComment ?? ''}
            disabled={disabled ?? data.relations?.length === 0}
            sx={{ display: 'flex', flexDirection: 'column', paddingRight: 2 }}
            validators={[requireMaxLength(400)]}
          />
        </Grid2>
      </Grid2>
    </>
  );

  /**
   *
   *        HELPER FUNCTIONS
   *
   */

  function resolveTitle(nodeName: NodeName) {
    if (nodeName === 'pgnode') return 'processgrupper eller processer';
    if (nodeName === 'processnode') return 'processer eller processgrupper';
    if (nodeName === 'issuenode') return 'ärendetyper';
  }

  async function handleSelect(
    voId: string,
    oaPath: string,
    nodeName: NodeName,
    auth: string
  ) {
    setSelectedArea(voId);
    const candidates = await getCandidates(oaPath, nodeName, auth);
    setRelationCandidates(candidates);
  }

  async function getCandidates(
    oaPath: string,
    nodeName: NodeName,
    auth: string
  ) {
    // needed to encode as it took slash in path for separate endpoint
    const encodedPath = btoa(oaPath);

    if (nodeName === 'issuenode') {
      // should we check locally too?
      const issueCandidates =
        await NodeRelationControllerService.getIssueRelationCandidates({
          ...RestHeaders.get,
          oaPath: encodedPath,
          auth,
        });

      return issueCandidates;
    } else if (nodeName === 'pgnode' || nodeName === 'processnode') {
      const processCandidates =
        await NodeRelationControllerService.getProcessRelationCanditates({
          ...RestHeaders.get,
          oaPath: encodedPath,
          auth,
        });

      return processCandidates;
    } else return [];
  }
};

export default RelationsCardContent;

/**
 *
 *        COMPONENTS
 *
 */
const ChosenRelation = ({
  dispatch,
  disabled,
  data,
}: {
  dispatch: (action: PayloadAction<unknown>) => void;
  disabled: boolean;
  data: CommonNode | RelationCandidate;
}) => {
  function resolveText(data: CommonNode) {
    let text = data.path
      ? `${data.path.substring(data.path.lastIndexOf('/') + 1)}`
      : '';

    if (data.nodeName === 'processnode' || data.nodeName === 'pgnode') {
      text = text + ' ' + data.name;
    }
    if (getEnv() !== 'PRD') {
      text = text + ' --- ID: ' + data.id;
    }
    return text;
  }

  if (!data) return <></>;

  function isCommonNode(
    node: CommonNode | RelationCandidate
  ): node is CommonNode {
    return (node as CommonNode).nodeName !== undefined;
  }

  return (
    <div
      style={{
        paddingBlock: '0.25rem',
        paddingRight: '1rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {!disabled && (
        <IconButton
          aria-label="remove relation"
          component="span"
          onClick={() => {
            if (data.path && data.id) {
              dispatch(actions.removeRelation(data.path));
              dispatch(actions.removeRelationNode(data.id));
            }
          }}
        >
          <ClearIcon />
        </IconButton>
      )}
      <Box
        sx={{
          marginLeft: '0.25rem',
          height: '100%',
          paddingBlock: '0.5rem',
          display: 'inline-flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <Typography marginLeft={disabled ? '1rem' : ''}>
          {isCommonNode(data) ? resolveText(data) : data.fullName}
        </Typography>
        <Divider variant="fullWidth" absolute sx={{ bottom: '0' }} />
      </Box>
    </div>
  );
};
