import mongoose from 'mongoose';
import testDBHandler from '../utils/setupTests';
import TodosService from '../routes/todos/todos.service';
import { TodoDto } from '../routes/todos/todo.dto';
import { todoModel } from '../models';

const todosService = new TodosService();

const testTodo: TodoDto = {
  title: 'Test todo',
  completed: false,
};

const testTodoMissingCompleted = {
  title: 'Test todo',
};

const testTodoMissingTitle = {
  completed: false,
};

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await testDBHandler.connect();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await testDBHandler.clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await testDBHandler.closeDatabase();
});

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
