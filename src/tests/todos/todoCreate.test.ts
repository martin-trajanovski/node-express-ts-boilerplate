import mongoose from 'mongoose';

import { todoModel } from '@src/models';
import { TodoDto } from '@src/routes/todos/todo.dto';
import TodosService from '@src/routes/todos/todos.service';
import testDBHandler from '@src/utils/testDBHandler';

// NOTE: Run the in-memory database.
testDBHandler.run();

const todosService = new TodosService();

const testTodo: TodoDto = {
  title: 'Test todo',
  completed: false,
  createdBy: mongoose.Types.ObjectId(),
};

const testTodoMissingCompleted = {
  title: 'Test todo',
  createdBy: mongoose.Types.ObjectId(),
};

const testTodoMissingTitle = {
  completed: false,
};

describe('todos.service.ts -> TODO create ', () => {
  test('When proper TODO is passed, there should be NO error', async () => {
    expect(async () => {
      await todosService.create(testTodo);
    }).not.toThrow();
  });

  test('When TODO without "completed" field is passed, there should be NO error', async () => {
    expect(async () => {
      await todosService.create(testTodoMissingCompleted as TodoDto);
    }).not.toThrow();
  });

  test('When TODO is created, it should exists in the database', async () => {
    await todosService.create(testTodo);

    const createdTodo = await todoModel.findOne();

    expect(createdTodo.title).toBe(testTodo.title);
  });

  test('When trying to create TODO without title, it should throw an error', async () => {
    await expect(
      todosService.create(testTodoMissingTitle as TodoDto)
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
