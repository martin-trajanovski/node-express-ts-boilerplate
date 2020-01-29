import express from 'express';
import { check, sanitize, validationResult } from 'express-validator';

import { HttpException } from '@src/exceptions';
import { Controller } from '@src/interfaces';

import CreateUserDto from '../user/user.dto';

import AuthenticationService from './authentication.service';
import LogInDto from './login.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registerUser);
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/logout`, this.loggingOut);
    this.router.post(`${this.path}/refreshToken`, this.refreshToken);
  }

  private registerUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await check('email', 'Email is not valid')
      .isEmail()
      .run(request);
    await check('password', 'Password must be at least 4 characters long')
      .isLength({ min: 4 })
      .run(request);
    await check('confirmPassword', 'Passwords do not match')
      .equals(request.body.password)
      .run(request);
    await sanitize('email')
      // eslint-disable-next-line @typescript-eslint/camelcase
      .normalizeEmail({ gmail_remove_dots: false })
      .run(request);

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      // TODO: Create WrongRequestParamsException and use that one here!
      return next(new HttpException(400, 'Wrong request params!', errors));
    }

    const userData: CreateUserDto = request.body;

    try {
      const { user } = await this.authenticationService.register(userData);
      await this.authenticationService.logUserActivity(user, 'signup');

      response.send({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private loginUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await check('email', 'Email is not valid')
      .isEmail()
      .run(request);
    await check('password', 'Password cannot be blank')
      .isLength({ min: 1 })
      .run(request);
    await sanitize('email')
      // eslint-disable-next-line @typescript-eslint/camelcase
      .normalizeEmail({ gmail_remove_dots: false })
      .run(request);

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return next(new HttpException(400, 'Wrong request params!', errors));
    }

    const logInData: LogInDto = request.body;

    try {
      const {
        authToken,
        refreshToken,
      } = await this.authenticationService.login(logInData);

      response.send({
        success: true,
        authToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await check('refreshToken', 'Refresh token cannot be blank')
      .isLength({ min: 1 })
      .run(request);

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      // TODO: Create WrongRequestParamsException and use that one here!
      return next(new HttpException(422, 'Invalid request!', errors));
    }

    const result = this.authenticationService.logout(request.body.refreshToken);

    response.send(result);
  };

  private refreshToken = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await check('refreshToken', 'Refresh token cannot be blank')
      .isLength({ min: 1 })
      .run(request);

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      // TODO: Create WrongRequestParamsException and use that one here!
      return next(new HttpException(422, 'Invalid request!', errors));
    }

    try {
      const authToken = await this.authenticationService.refreshToken(
        request.body.refreshToken
      );

      response.send({
        success: true,
        authToken,
      });
    } catch (error) {
      next(error);
    }
  };

  // private createCookie(tokenData: TokenData) {
  //   return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  // }
}

export default AuthenticationController;
