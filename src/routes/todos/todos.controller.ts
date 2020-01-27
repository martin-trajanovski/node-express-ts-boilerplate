import express from 'express';
import { Controller } from '../../interfaces';
import TodosService from './todos.service';
import { check, validationResult } from 'express-validator';
import { HttpException } from '../../exceptions';
import { TodoDto } from './todo.dto';
// import authMiddleware from '../../middlewares/auth.midleware';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();
  public todosService = new TodosService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // NOTE: We can use this form as well if we want to apply authMiddleware to all routes.
    // this.router.all(`${this.path}/*`, authMiddleware)
    this.router.get(`${this.path}`, this.getAll);
    this.router.post(`${this.path}`, this.add);
  }

  private getAll = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const limit: number = request.query.hasOwnProperty('limit')
        ? parseInt(request.query.limit)
        : 10;
      const todos = await this.todosService.getAll(limit);

      response.send({
        success: true,
        todos,
      });
    } catch (error) {
      next(error);
    }
  };

  private add = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await check('title', 'Title can not be blank')
        .isLength({ min: 1 })
        .run(request);

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return next(new HttpException(400, 'Wrong request params!', errors));
      }

      const todoData: TodoDto = request.body;

      const todo = await this.todosService.create(todoData);

      response.send({
        success: true,
        todo,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TodosController;
