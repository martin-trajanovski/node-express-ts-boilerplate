import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './routes/authentication/authentication.controller';
import UsersController from './routes/users/users.controller';
import TodosController from './routes/todos/todos.controller';

validateEnv();

const app = new App([
  new AuthenticationController(),
  new UsersController(),
  new TodosController(),
]);

app.listen();
