import { Types } from 'mongoose';

import { HttpException } from '@src/exceptions';
import { Todo } from '@src/interfaces';
import { todoModel } from '@src/models';

import { TodoDto } from './todo.dto';

class TodosService {
  private todos = todoModel;

  public async getAll(limit: number = 10): Promise<Todo[]> {
    try {
      const result = await this.todos.find({}).limit(limit);

      return result;
    } catch (error) {
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async create(newTodo: TodoDto): Promise<Todo> {
    try {
      const todo = await this.todos.create(newTodo);

      return todo;
    } catch (error) {
      throw error;
    }
  }

  public async update(todoToUpdate: Todo): Promise<Todo> {
    try {
      const updatedTodo = await this.todos.findByIdAndUpdate(
        todoToUpdate._id,
        todoToUpdate,
        { new: true }
      );

      if (!updatedTodo) {
        throw new HttpException(404, 'Todo not found');
      }

      return updatedTodo;
    } catch (error) {
      throw error;
    }
  }

  public async remove(todoToRemoveId: Types.ObjectId): Promise<Todo> {
    try {
      const removedTodo = await this.todos.findByIdAndRemove(todoToRemoveId);

      if (!removedTodo) {
        throw new HttpException(404, 'Todo not found');
      }

      return removedTodo;
    } catch (error) {
      throw error;
    }
  }
}

export default TodosService;
