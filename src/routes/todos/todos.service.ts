import { HttpException } from '@src/exceptions';
import { todoModel } from '@src/models';
import { Todo } from '@src/interfaces';
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
}

export default TodosService;
