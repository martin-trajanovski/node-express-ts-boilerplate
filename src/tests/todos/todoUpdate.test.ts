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
  test('When updating todo by id, should return it updated', async () => {
    const todo = await todosService.create(fakeTodo);
    todo.completed = !todo.completed;

    const updatedTodo = await todosService.update(todo);

    expect(updatedTodo.completed).toBeTruthy();
  });

  test('When passing random id to update todo, should throw not found error', async () => {
    await expect(
      todosService.update({ ...fakeTodo, _id: mongoose.Types.ObjectId() })
    ).rejects.toThrow(new HttpException(404, 'Todo not found'));
  });
});
