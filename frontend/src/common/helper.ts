import { ApiError, ClassificationStructureTypeNodeDto } from 'Models/index';
import { CommonNode, NodeMap, NodeName } from 'Models/typed';
import moment from 'moment';
import 'moment-timezone';
import { informationsecurityclassAlternatives } from './constants';

export function sortOnId(a: { id?: string }, b: { id?: string }) {
  if (a.id && b.id) {
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  }
  return -1;
}

export function sortlocalOnClassPath(
  a?: { localPath?: string },
  b?: { localPath?: string }
) {
  if (!a || !b) return 0;
  if (a.localPath && b.localPath) {
    const parts1 = a.localPath.split('\\.');
    const parts2 = b.localPath.split('\\.');

    const maxLength = Math.min(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
      const p1 = parseInt(parts1[i]);
      const p2 = parseInt(parts2[i]);

      if (p1 != p2) {
        return p1 - p2;
      }
    }
    return parts1.length - parts2.length;
  }
  return 0;
}

export const removeUUIDFromPath = (path: string): string => {
  if (!path) {
    return '';
  }
  const pathArr = path.split('/');
  const reduced = pathArr.reduce((acc: string[], current) => {
    if (current.length !== 0 && current.indexOf('-') === -1) {
      acc.push(current);
    }
    return acc;
  }, []);
  return `1/${reduced.join('/')}`;
};

export const getParentCode = (path?: string, onlyNumber?: boolean) => {
  if (path) {
    const matched = path.match(/[^/]+/gm);
    if (matched && !onlyNumber) {
      return matched[matched.length - 2];
    }
    if (matched && onlyNumber) {
      const paths = matched.filter(
        (m) => !m.startsWith('ÄT') && !m.startsWith('HT')
      );
      return paths[paths.length - 1];
    }
  }
  return '';
};

export const getOwnClassCodeFromPath = (path?: string) => {
  if (path) {
    const paths = path.match(/[^/]+$/gm);
    return paths ? paths[0] : '';
  }
  return '';
};

export const nodeTypeMapper = (nodeName: NodeName): NodeMap => {
  switch (nodeName) {
    case 'csnode':
      return {
        path: 'ks',
        label: 'Verksamhetsområden',
        name: 'Klassificeringsstruktur',
        avatarStyle: {
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid black',
        },
        avatarText: 'KS',
      };
    case 'documentnode':
      return {
        path: 'document',
        name: 'Handlingstyp',
        avatarStyle: { backgroundColor: '#FFC107', color: 'black' },
        label: 'Informationsobjekttyp',
        avatarText: 'HT',
      };
    case 'issuenode':
      return {
        path: 'issue',
        name: 'Ärendetyp',
        avatarStyle: {
          backgroundColor: '#4941CF',
          color: 'white',
        },
        label: 'Handlingstyp',
        avatarText: 'ÄT',
      };
    case 'oanode':
      return {
        path: 'vo',
        label: 'Process, Processgrupp',
        name: 'Verksamhetsområde',
        avatarStyle: { backgroundColor: '#8b1327', color: 'white' },
        avatarText: 'VO',
      };
    case 'pgnode':
      return {
        path: 'pg',
        label: 'Process, Processgrupp',
        name: 'Processgrupp',
        avatarStyle: { backgroundColor: '#83AFC9', color: 'black' },
        avatarText: 'PG',
      };
    case 'processnode':
      return {
        path: 'process',
        name: 'Process',
        avatarStyle: { backgroundColor: '#FD084A', color: 'black' },
        label: 'Ärendetyp',
        avatarText: 'P',
      };

    default:
      break;
  }
  return {
    path: '',
    label: '',
    name: '',
    avatarStyle: { color: 'red' },
    avatarText: '',
  };
};

export const requiredFullfilled = (data: CommonNode) => {
  if (!data?.name) {
    return false;
  }

  let fullfilled = data.name.length !== 0 && data.start.length !== 0;
  switch (data.nodeName) {
    case 'documentnode':
      fullfilled =
        fullfilled &&
        data.informationsecurityclass !== null &&
        data.keepingUnit !== null &&
        data.secrecy !== null &&
        data.personalData !== null &&
        data.keepingUnit.length !== 0;
      if (data.assignedRules && data.assignedRules.length !== 0) {
        fullfilled = data.regulation ? data.regulation.length > 0 : false;
      }

      break;
    case 'issuenode':
      fullfilled =
        fullfilled &&
        data.keepingUnit !== null &&
        data.keepingUnit.length !== 0;
      break;
    case 'processnode':
    case 'pgnode':
      fullfilled =
        fullfilled &&
        data.informationResponsible !== null &&
        data?.informationResponsible?.length !== 0;
      break;
    case 'oanode':
      fullfilled = fullfilled && data.authDecision?.length !== 0;
      break;
    case 'csnode':
      fullfilled =
        fullfilled &&
        data.authDecision !== null &&
        data.authDecision.length !== 0;
      break;

    default:
      break;
  }
  return fullfilled;
};

export const isKS = (nodeName: NodeName) =>
  nodeName === 'csnode' ||
  nodeName === 'oanode' ||
  nodeName === 'pgnode' ||
  nodeName === 'processnode';

export const isIHP = (nodeName: NodeName) =>
  nodeName === 'issuenode' || nodeName === 'documentnode';

export const ksHasEnded = (ks: ClassificationStructureTypeNodeDto) => {
  const today = moment();
  const ksEnd = ks.stop ? moment(ks.stop) : moment('8000-01-01');
  const hasEnded = today.isAfter(ksEnd);
  return hasEnded;
};

export const getErrorMessage = (error: ApiError) => {
  return `${error.body || error}`;
};

export const downloadFile = ({
  data,
  fileName,
  fileType = 'text/json',
}: {
  data: BlobPart;
  fileName: string;
  fileType?: string;
}) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

type Environment = 'UTV' | 'TST' | 'PRD' | 'LOCAL' | null;

export const getEnv = (): Environment => {
  const { hostname } = window.location;
  if (hostname.startsWith('localhost')) return 'LOCAL';
  if (hostname.includes('utv')) return 'UTV';
  if (hostname.includes('tst')) return 'TST';
  if (hostname.includes('prd')) return 'PRD';
  return null;
};

export function shortenText(text: string, nrChars: number): string {
  if (text.length > nrChars) {
    return `${text.substring(0, nrChars)}...`;
  }
  return text;
}

export function displayDateWithTimezone(
  dateString?: string,
  useLocalTime = true
) {
  if (!dateString) return 'Inget datum';
  const date = moment(
    dateString.includes('+') ? dateString : `${dateString}-00`
  );
  let formattedDate;
  if (useLocalTime) {
    formattedDate = date.tz('Europe/Stockholm').format('YYYY-MM-DD HH:mm');
  } else {
    formattedDate = date.utc().format('YYYY-MM-DD HH:mm');
  }

  return formattedDate;
}

export const getInformationSecurityText = (securityClass: string) =>
  informationsecurityclassAlternatives.find(
    (item) => item.value === Number(securityClass)
  )?.label;
