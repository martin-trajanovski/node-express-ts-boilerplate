import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import {
  AuthenticationTokenMissingException,
  WrongAuthenticationTokenException,
} from '@src/exceptions';
import { DataStoredInToken, RequestWithUser } from '@src/interfaces';
import { userModel } from '@src/models';

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  let authToken = request.headers['authorization'];

  if (!authToken) {
    return next(new AuthenticationTokenMissingException());
  }

  authToken = authToken.replace('Bearer ', '');

  if (authToken) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        authToken,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
