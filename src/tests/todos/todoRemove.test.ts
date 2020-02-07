import faker from 'faker';
import mongoose from 'mongoose';

import { HttpException } from '@src/exceptions';
import { TodoDto } from '@src/routes/todos/todo.dto';
import TodosService from '@src/routes/todos/todos.service';
import testDBHandler from '@src/utils/testDBHandler';

testDBHandler.run();
const todosService = new TodosService();

const fakeTodo: TodoDto = {
  title: faker.random.words(),
  completed: false,
  createdBy: mongoose.Types.ObjectId(),
};

describe('todos.service.ts -> TODO update', () => {
  test('When removing todo by id, should return removed todo and it should not be in the database', async () => {
    const limitTo = 10;
    const userId = fakeTodo.createdBy;
    const todo = await todosService.create(fakeTodo);

    const removedTodo = await todosService.remove(todo._id);
    const todos = await todosService.getAll(limitTo, userId);

    expect(removedTodo._id).toBeDefined();
    expect(todos).not.toContain(removedTodo);
  });

  test('When passing random id to remove todo, should throw not found error', async () => {
    await expect(
      todosService.remove(mongoose.Types.ObjectId())
    ).rejects.toThrow(new HttpException(404, 'Todo not found'));
  });
});
