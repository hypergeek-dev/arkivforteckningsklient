import { Box, Stack, Typography } from '@mui/material';
import { STATUS_SV } from 'Common/constants';
import {
  displayDateWithTimezone,
  getInformationSecurityText,
} from 'Common/helper';
import {
  ClassificationStructureTypeNodeDto,
  DocumentTypeNodeDto,
  IssueTypeNodeDto,
  OperationalAreaTypeNodeDto,
  ProcessGroupTypeNodeDto,
  ProcessTypeNodeDto,
  RuleDto,
} from 'Models/index';
import { CommonNode, Status } from 'Models/typed';
import React, { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectProcessName } from 'Store/ducks/data/selectors';
import { selectDocumentTypeForNode } from 'Store/ducks/elements/selectors';
import { useAppSelector } from 'Store/hooks';
import NodetypeIcon from '../NodetypeIcon';
import CardSymbol, { SymbolOptions } from './CardSymbol';
import { FormattedDate } from './IHPCard';
import StatusSymbol from './StatusSymbol';
import { selectors } from 'Store/ducks/IHPToolStructure';
import { ViewTabValues } from 'Store/ducks/IHPToolStructure/reducer';

type IHPCardBodyProps = {
  node: CommonNode;
};
type CSBodyProps = {
  node: ClassificationStructureTypeNodeDto;
};
type OABodyProps = {
  node: OperationalAreaTypeNodeDto;
};
type ProcessBodyProps = {
  node: ProcessTypeNodeDto | ProcessGroupTypeNodeDto;
};
type IssueBodyProps = {
  node: IssueTypeNodeDto;
};
type DocumentBodyProps = {
  node: DocumentTypeNodeDto;
};

const IHPCardBody: React.FC<IHPCardBodyProps> = ({ node }) => {
  const { nodeName } = node;

  const view = useAppSelector(selectors.selectViewTab);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <ScrollBox view={view}>
        {nodeName === 'csnode' && <CSBody node={node} />}
        {nodeName === 'oanode' && <OABody node={node} />}
        {(nodeName === 'pgnode' || nodeName === 'processnode') && (
          <PBody node={node} />
        )}
        {nodeName === 'issuenode' && <IssueBody node={node} />}
        {nodeName === 'documentnode' && <DocBody node={node} />}

        {/*isDevMode() && <RouterDebug node={node} />*/}
      </ScrollBox>
    </Box>
  );
};

type ScrollBoxProps = {
  view: ViewTabValues;
  children: ReactNode;
};
const ScrollBox: FC<ScrollBoxProps> = ({ view, children }) => (
  <Box
    sx={{
      maxWidth: '340px',
      maxHeight: view === 'card' ? '210px' : 'auto',
      overflow: 'auto',
      scrollbarWidth: 'thin',
      paddingBottom: view === 'card' ? '1rem' : '0',
    }}
  >
    {children}
    {view === 'card' && (
      <Box
        sx={{
          height: '30px',
          position: 'absolute',
          bottom: '10px',
          width: '97%',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255, 1))',
        }}
      />
    )}
  </Box>
);

const StatusRow: React.FC<{ status: Status; time?: string; user?: string }> = ({
  status,
  time,
  user,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }}
  >
    <StatusSymbol status={status} />
    <Typography sx={{ marginLeft: '6px' }} variant="ihpcardbody_rowCapped">
      {STATUS_SV[status]}, {displayDateWithTimezone(time)}, {user}
    </Typography>
  </Box>
);

const SymbolRow: React.FC<{
  symbol: SymbolOptions;
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ symbol, ariaLabel, children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }}
  >
    <CardSymbol symbol={symbol} ariaLabel={ariaLabel} />
    <Typography sx={{ marginLeft: '6px' }} variant="ihpcardbody_rowCapped">
      {children}
    </Typography>
  </Box>
);

export default IHPCardBody;

const CSBody: React.FC<CSBodyProps> = ({ node }) => (
  <>
    <Typography variant="ihpcardbody_rowCapped">
      <strong>Myndighetens namn:</strong> {node.authName}
    </Typography>
    <Typography variant="ihpcardbody_rowCapped">
      <strong>Myndighetens beslut:</strong> {node.authDecision}
    </Typography>
    <Typography variant="ihpcardbody_rowCapped">
      <strong>Status:</strong> {STATUS_SV[node.status]}
    </Typography>
    <Typography variant="ihpcardbody_rowCapped">
      <strong>Giltighetstid:</strong> <FormattedDate date={node.start} />
      {' - '}
      {node.stop ? <FormattedDate date={node.stop} /> : 'Tillsvidare'}
    </Typography>
  </>
);

const OABody: React.FC<OABodyProps> = ({ node }) => {
  return (
    <>
      <StatusRow
        status={node.status}
        time={node.updated || node.createdAt}
        user={node.updatedBy || node.createdBy}
      />
      <SymbolRow symbol="calendar" ariaLabel="Giltighetstid">
        <FormattedDate date={node.start} />
        {' - '}
        {node.stop ? <FormattedDate date={node.stop} /> : 'Tillsvidare'}
      </SymbolRow>

      <SymbolRow symbol="hammer" ariaLabel="Myndighetens beslut">
        Myndighetens beslut: {node.authDecision}
      </SymbolRow>
    </>
  );
};

// for processess and processgroups
const PBody: React.FC<ProcessBodyProps> = ({ node }) => {
  const { informationResponsible, contact } = node;

  return (
    <>
      <StatusRow
        status={node.status}
        time={node.updated || node.createdAt}
        user={node.updatedBy || node.createdBy}
      />
      <SymbolRow symbol="calendar" ariaLabel="Giltighetstid">
        <FormattedDate date={node.start} />
        {' - '}
        {node.stop ? <FormattedDate date={node.stop} /> : 'Tillsvidare'}
      </SymbolRow>

      {informationResponsible && (
        <SymbolRow
          symbol="informationResponsible"
          ariaLabel="Informationsansvarig"
        >
          Informationsansvarig: {informationResponsible}
        </SymbolRow>
      )}
      {contact ? (
        <SymbolRow symbol="contact" ariaLabel="Kontaktperson">
          Kontaktperson: {contact}
        </SymbolRow>
      ) : (
        <></>
      )}
    </>
  );
};

const IssueBody: React.FC<IssueBodyProps> = ({ node }) => {
  const processName = useSelector((state) =>
    selectProcessName(state, node.path ?? '')
  );
  return (
    <>
      <StatusRow
        status={node.status}
        time={node.updated || node.createdAt}
        user={node.updatedBy || node.createdBy}
      />
      <SymbolRow symbol="calendar" ariaLabel="Giltighetstid">
        <FormattedDate date={node.start} />
        {' - '}
        {node.stop ? <FormattedDate date={node.stop} /> : 'Tillsvidare'}
      </SymbolRow>
      <Stack direction={'row'} gap={1}>
        <NodetypeIcon size="small" nodeName={'processnode'} />
        <Typography variant="ihpcardbody_rowCapped">{processName}</Typography>
      </Stack>
    </>
  );
};

const DocBody: React.FC<DocumentBodyProps> = ({ node }) => {
  const processName = useSelector((state) =>
    selectProcessName(state, node.path ?? '')
  );
  const documentType = useAppSelector((state) =>
    selectDocumentTypeForNode(state, node)
  );
  const { personalData, informationsecurityclass, secrecy, assignedRules } =
    node;

  const textRule = assignedRules?.find(
    (rule: RuleDto) => rule.ruleType === 'TEXT_RULE'
  );

  const defaultRule = assignedRules?.find(
    (rule: RuleDto) => rule.ruleType === 'DEFAULT_RULE'
  );
  const exceptionRule = assignedRules?.find(
    (rule: RuleDto) => rule.ruleType === 'EXCEPTION_RULE'
  );

  return (
    <>
      <StatusRow
        status={node.status}
        time={node.updated ?? node.createdAt}
        user={node.updatedBy ?? node.createdBy}
      />
      <SymbolRow symbol="calendar" ariaLabel="Giltighetstid">
        <FormattedDate date={node.start} />
        {' - '}
        {node.stop ? <FormattedDate date={node.stop} /> : 'Tillsvidare'}
      </SymbolRow>

      {informationsecurityclass && (
        <SymbolRow symbol="shield" ariaLabel="Skyddsklass">
          {Number(informationsecurityclass) > 4
            ? 'Säkerhetsskydd: '
            : 'Verksamhetsskydd: '}{' '}
          {getInformationSecurityText(informationsecurityclass)}
        </SymbolRow>
      )}

      {personalData ? (
        <SymbolRow symbol="contact" ariaLabel="personuppgifter">
          Behandlar personuppgifter
        </SymbolRow>
      ) : (
        <></>
      )}

      {secrecy ? (
        <SymbolRow symbol="secret" ariaLabel="sekretess">
          Omfattas av sekretess
        </SymbolRow>
      ) : (
        <></>
      )}
      {!textRule && !defaultRule && (
        <SymbolRow symbol="save" ariaLabel="Manuellt gallra">
          <b>Gallringsregel:</b> Handlingen bevaras
        </SymbolRow>
      )}

      {textRule && (
        <SymbolRow symbol="manualDelete" ariaLabel="Manuellt gallra">
          <b>Manuellt gallra:</b> {textRule.description} (Referensregel)
        </SymbolRow>
      )}
      {defaultRule && (
        <SymbolRow symbol="trashcan" ariaLabel="Gallras">
          <b>Gallringsregel:</b> {defaultRule.description}
        </SymbolRow>
      )}
      {exceptionRule && (
        <SymbolRow symbol="dontDelete" ariaLabel="Undantagsregel">
          <b>Undantagsregel:</b> {exceptionRule.description}
        </SymbolRow>
      )}

      <SymbolRow symbol="register" ariaLabel="Registreras">
        Registreras: {node.register ? 'Ja' : 'Nej'}
      </SymbolRow>
      <SymbolRow symbol="subject" ariaLabel="Dokumenttyp">
        Dokumenttyp: {documentType ? documentType.name : <em>saknas</em>}
      </SymbolRow>
      <Stack direction={'row'} gap={1}>
        <NodetypeIcon size="small" nodeName={'processnode'} />
        <Typography variant="ihpcardbody_rowCapped">{processName}</Typography>
      </Stack>
    </>
  );
};
