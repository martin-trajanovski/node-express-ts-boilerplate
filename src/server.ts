import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import AuthenticationController from './routes/authentication/authentication.controller';
import TodosController from './routes/todos/todos.controller';
import UsersController from './routes/users/users.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  new AuthenticationController(),
  new UsersController(),
  new TodosController(),
]);

app.listen();
