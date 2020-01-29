import { TodoDto } from '@src/routes/todos/todo.dto';
import TodosService from '@src/routes/todos/todos.service';
import testDBHandler from '@src/utils/testDBHandler';

// NOTE: Run the in-memory database.
testDBHandler.run();

const todosService = new TodosService();

const testTodo: TodoDto = {
  title: 'Test todo',
  completed: false,
};

const createTodos = async (numberOfTodos: number) => {
  while (numberOfTodos--) {
    await todosService.create(testTodo);
  }
};

describe('todos.service.ts -> TODO getAll ', () => {
  test('When getting all TODOs, should return empty array without errors', async () => {
    const todos = await todosService.getAll();

    expect(todos).toEqual([]);
  });

  test('When getting all TODOs with limit, should return limited results', async () => {
    const numberOfTodos = 10;
    const limitTo = 5;
    await createTodos(numberOfTodos);

    const todos = await todosService.getAll(limitTo);

    expect(todos.length).toBe(limitTo);
  });
});
