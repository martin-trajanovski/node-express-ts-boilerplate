import httpMocks from 'node-mocks-http';

import {
  AuthenticationTokenMissingException,
  WrongAuthenticationTokenException,
} from '@src/exceptions';
import authMiddleware from '@src/middlewares/auth.middleware';

describe('auth.middleware.ts', () => {
  test('A request without authentication header, should return "AuthenticationTokenMissingException"', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/todos',
      headers: {
        authorization: '',
      },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(request, response, next);

    expect(next).toBeCalledWith(new AuthenticationTokenMissingException());
  });

  test('A request with invalid authentication header, should return "WrongAuthenticationTokenException"', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/todos',
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(request, response, next);

    expect(next).toBeCalledWith(new WrongAuthenticationTokenException());
  });
});
