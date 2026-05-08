import { TermDto } from 'Models/index';
import { RegulationTypes, TimeSelect } from 'Models/typed';
import { RegulationState } from 'Store/ducks/regulation/reducer';

export const DEFINED_ATTRIBUTES = {
  ISSUE_END: {
    name: 'ISSUE_END',
    label: 'ärendet har avslutats',
    steps: ['CREATE', 'EVENT1', 'EVENT2', 'TIME1', 'TIME2', 'COMMENT'],
  },
  DOCUMENT_RECEIVED: {
    name: 'DOCUMENT_RECEIVED',
    label: 'handlingen har inkommit',
    steps: ['CREATE', 'TIME1', 'EVENT1', 'COMMENT'],
  },
  DOCUMENT_ACCEPTED: {
    name: 'DOCUMENT_ACCEPTED',
    label: 'handlingen upprättades',
    steps: ['CREATE', 'TIME1', 'EVENT1', 'COMMENT'],
  },
  ISSUE_REVIEWED: {
    name: 'ISSUE_REVIEWED',
    label: 'ärendet överprövas',
    steps: ['CREATE', 'EVENT1'],
  },
  RELATED_ISSUE_REVIEWED: {
    name: 'RELATED_ISSUE_REVIEWED',
    label: 'relaterat ärende överprövas',
    steps: ['CREATE', 'EVENT1'],
  },
  ISSUE_APPEALED: {
    name: 'ISSUE_APPEALED',
    label: 'ärendet överklagas',
    steps: ['CREATE', 'EVENT1'],
  },
  RELATED_ISSUE_APPEALED: {
    name: 'RELATED_ISSUE_APPEALED',
    label: 'relaterat ärende överklagas',
    steps: ['CREATE', 'EVENT1'],
  },
  RELATED_ISSUE_ENDED: {
    name: 'RELATED_ISSUE_ENDED',
    label: 'relaterat ärende har avslutats',
    steps: ['CREATE', 'TIME1', 'EVENT1'],
  },
};

export function timeTermSelected(t: TimeSelect) {
  return t.day !== 0 || t.immediately || t.month !== 0 || t.year !== 0;
}

function emptyState(s: RegulationState) {
  return (
    s.dummyName.length === 0 &&
    s.dummyText.length === 0 &&
    !s.eventTerm1 &&
    !s.eventTerm2 &&
    !timeTermSelected(s.timeTerm1) &&
    !timeTermSelected(s.timeTerm2)
  );
}

export interface CommandTextObject {
  text: string;
  type: 'TERMATTRIBUTE' | 'TEXT' | 'TIME' | 'COMMENT';
}

export function getText(cmdObject: RegulationState): CommandTextObject[] {
  const {
    createType,
    timeTerm1,
    timeTerm2,
    eventTerm1,
    eventTerm2,
    dummyText,
  } = cmdObject;
  const commandText: CommandTextObject[] = [];
  switch (createType) {
    case 'DEFAULT_RULE':
      if (emptyState(cmdObject)) {
        commandText.push({ text: 'Handlingen gallras efter...', type: 'TEXT' });
        return commandText;
      } else {
        if (timeTerm1.immediately) {
          commandText.push({
            text: 'Handlingen gallras omedelbart efter ',
            type: 'TEXT',
          });
        }
        if (timeTermSelected(timeTerm1) && !timeTerm1.immediately) {
          commandText.push({
            text: eventTerm1
              ? 'Handlingen gallras'
              : 'Handlingen gallras efter ',
            type: 'TEXT',
          });
          commandText.push({
            text: timeTextCreator(timeTerm1),
            type: 'TIME',
          });
        }
        if (eventTerm1) {
          commandText.push({
            text: `efter att`,
            type: 'TEXT',
          });
          commandText.push({
            text: `${DEFINED_ATTRIBUTES[eventTerm1].label}.`,
            type: 'TERMATTRIBUTE',
          });
        }
        if (eventTerm2) {
          commandText.push({
            text: `Och`,
            type: 'TEXT',
          });
          commandText.push({
            text: `${DEFINED_ATTRIBUTES[eventTerm2].label}`,
            type: 'TERMATTRIBUTE',
          });
        }
        if (timeTermSelected(timeTerm2)) {
          commandText.push({
            text: `för`,
            type: 'TEXT',
          });
          commandText.push({
            text: `${timeTextCreator(timeTerm2)}`,
            type: 'TIME',
          });
          commandText.push({
            text: `sen.`,
            type: 'TEXT',
          });
        }
      }
      break;
    case 'EXCEPTION_RULE':
      if (emptyState(cmdObject)) {
        commandText.push({
          text: 'Handlingen bevaras om...',
          type: 'TEXT',
        });
      } else {
        if (eventTerm1) {
          commandText.push({
            text: `Handlingen bevaras om`,
            type: 'TEXT',
          });
          commandText.push({
            text: `${DEFINED_ATTRIBUTES[eventTerm1].label}`,
            type: 'TERMATTRIBUTE',
          });
        }
        if (timeTermSelected(timeTerm1)) {
          commandText.push({
            text: `för ${timeTextCreator(timeTerm1)} sedan.`,
            type: 'TIME',
          });
        }
      }
      break;
    case 'TEXT_RULE':
      if (emptyState(cmdObject)) {
        commandText.push({
          text: 'Beskriv regel...',
          type: 'TEXT',
        });
      } else {
        commandText.push({
          text: dummyText,
          type: 'TEXT',
        });
      }
      break;

    default:
      break;
  }
  return commandText;
}

function timeTextCreator(timeTerm: TimeSelect) {
  const result = [];
  if (timeTerm.year !== 0) result.push(`${timeTerm.year} år`);
  if (timeTerm.month !== 0)
    result.push(
      timeTerm.month > 1
        ? `${timeTerm.month} månader`
        : `${timeTerm.month} månad`
    );
  if (timeTerm.day !== 0)
    result.push(
      timeTerm.day > 1 ? `${timeTerm.day} dagar` : `${timeTerm.day} dag`
    );
  if (timeTerm.immediately) result.push('omedelbart');
  if (result.length === 1) {
    return result.join('');
  }

  if (result.length === 3) {
    return result
      .map((c, i) => {
        if (i === 1) {
          return `, ${c}`;
        }
        if (i === 2) {
          return ` och ${c}`;
        }

        return c;
      })
      .join('');
  }

  if (result.length === 2) return result.join(' och ');
  return result.join('');
}

export function createRuleName(
  type: RegulationTypes,
  timeSelect: TimeSelect,
  name?: string
): string {
  let result = '';
  switch (type) {
    case 'DEFAULT_RULE':
      if (timeSelect.immediately) {
        result = 'Omedelbart';
      }
      if (timeSelect.year) {
        result = `${timeSelect.year} år`;
      }
      if (timeSelect.month) {
        result += ` ${timeSelect.month} månader`;
      }
      if (timeSelect.day) {
        result += ` ${timeSelect.day} dagar`;
      }
      break;
    case 'EXCEPTION_RULE':
      result = 'Undantag';
      break;
    case 'TEXT_RULE':
      result = name ?? 'Textregel';
      break;

    default:
      break;
  }

  return result;
}

export function createTerm(
  t1?: TimeSelect,
  eventTerm1?: TermDto['attribute'],
  t2?: TimeSelect,
  eventTerm2?: TermDto['attribute']
): TermDto[] {
  const result: TermDto[] = [];

  if (eventTerm1 && t1) {
    result.push({
      attribute: eventTerm1,
      operand: 'GREATER',
      months: t1.month,
      days: t1.day,
      years: t1.year,
    });
  }

  if (eventTerm2 && t2) {
    result.push({
      attribute: eventTerm2,
      operand: 'GREATER',
      months: t2.month,
      days: t2.day,
      years: t2.year,
    });
  }

  return result;
}
