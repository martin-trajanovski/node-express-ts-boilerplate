import express from 'express';
import { check, validationResult } from 'express-validator';
import { Types } from 'mongoose';

import { HttpException } from '@src/exceptions';
import { Controller, Todo } from '@src/interfaces';
import authMiddleware from '@src/middlewares/auth.middleware';

import { TodoDto } from './todo.dto';
import TodosService from './todos.service';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();
  public todosService = new TodosService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // NOTE: We can use this form as well if we want to apply authMiddleware to all routes.
    // this.router.all(`${this.path}/*`, authMiddleware);
    this.router.get(`${this.path}`, authMiddleware, this.getAll);
    this.router.post(`${this.path}`, authMiddleware, this.create);
    this.router.put(`${this.path}`, authMiddleware, this.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.remove);
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

  private create = async (
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

      response.status(201).send({
        success: true,
        todo,
      });
    } catch (error) {
      next(error);
    }
  };

  private update = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await check('_id', '_id must be valid')
        .isMongoId()
        .run(request);

      await check('title', 'Title can not be blank')
        .isLength({ min: 1 })
        .run(request);

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return next(new HttpException(400, 'Wrong request params!', errors));
      }

      const todoData: Todo = request.body;

      const todo = await this.todosService.update(todoData);

      response.send({
        success: true,
        todo,
      });
    } catch (error) {
      next(error);
    }
  };

  private remove = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const todoToRemoveId: string = request.params.id;

      // NOTE: Validate id param manually for now. Check if it is possible to do it with express-validator.
      if (!todoToRemoveId || !todoToRemoveId.match(/^[0-9a-fA-F]{24}$/)) {
        const errors = [{ msg: 'Invalid id', param: 'id', location: 'params' }];

        return next(
          new HttpException(400, 'Wrong request params!', { errors })
        );
      }

      const todo = await this.todosService.remove(
        Types.ObjectId(todoToRemoveId)
      );

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
