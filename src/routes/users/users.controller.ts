import express from 'express';
import { Controller } from '../../interfaces';
import UsersService from './users.service';
import authMiddleware from '../../middlewares/auth.midleware';

class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();
  public usersService = new UsersService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // NOTE: We can use this form as well if we want to apply authMiddleware to all routes.
    // this.router.all(`${this.path}/*`, authMiddleware)
    this.router.get(`${this.path}`, authMiddleware, this.getAll);
  }

  private getAll = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const users = await this.usersService.getAll();

      response.send({
        success: true,
        users,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
