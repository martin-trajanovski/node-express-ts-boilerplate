import mongoose from 'mongoose';
import faker from 'faker';
import testDBHandler from '@src/utils/testDBHandler';
import { TodoDto } from '@src/routes/todos/todo.dto';
import TodosService from '@src/routes/todos/todos.service';
import { HttpException } from '@src/exceptions';

testDBHandler.run();
const todoService = new TodosService();

const fakeTodo: TodoDto = {
  title: faker.random.words(),
  completed: false,
};

describe('todos.service.ts -> TODO update', () => {
  test('When updating todo by id, should return it updated', async () => {
    const todo = await todoService.create(fakeTodo);
    todo.completed = !todo.completed;

    const updatedTodo = await todoService.update(todo);

    expect(updatedTodo.completed).toBeTruthy();
  });

  test('When passing random id to update todo, should throw not found error', async () => {
    await expect(
      todoService.update({ ...fakeTodo, _id: mongoose.Types.ObjectId() })
    ).rejects.toThrow(new HttpException(404, 'Todo not found'));
  });
});
