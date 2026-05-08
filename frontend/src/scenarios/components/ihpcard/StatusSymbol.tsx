import {
  AssignmentTurnedInOutlined,
  CheckOutlined,
  CheckCircleOutline,
  HandymanOutlined,
} from '@mui/icons-material';

import { Status } from 'Models/typed';
import React from 'react';

interface StatusSymbolProps {
  status: Status;
}

const StatusSymbol: React.FC<StatusSymbolProps> = ({ status }) => {
  return (
    <>
      {status === 'utkast' && (
        <HandymanOutlined sx={{ width: '16px', height: '16px' }} />
      )}
      {status === 'klar' && (
        <AssignmentTurnedInOutlined sx={{ width: '16px', height: '16px' }} />
      )}
      {status === 'godkand' && (
        <CheckOutlined
          sx={() => ({
            width: '16px',
            height: '16px',
          })}
        />
      )}
      {status === 'faststalld' && (
        <CheckCircleOutline
          sx={() => ({
            width: '16px',
            height: '16px',
          })}
        />
      )}
    </>
  );
};

export default StatusSymbol;
