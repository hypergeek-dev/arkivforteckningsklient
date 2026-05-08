import * as uuid from 'uuid';

const RestHeaders = {
  get: {
    consumer: 'IhpService',
    apiVersion: '1',
    correlationId: uuid.v4(),
  },
  delete: {
    consumer: 'IhpService',
    apiVersion: '1',
    correlationId: uuid.v4(),
  },
  post: {
    consumer: 'IhpService',
    apiVersion: '1',
    correlationId: uuid.v4(),
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
  },
  put: {
    consumer: 'IhpService',
    apiVersion: '1',
    correlationId: uuid.v4(),
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
  },
  postFile: {
    consumer: 'IhpService',
    apiVersion: '1',
    correlationId: uuid.v4(),
    Accept: '*/*',
  },
};

export default RestHeaders;
