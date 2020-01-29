import bodyParser from 'body-parser';
import chalk from 'chalk';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import lusca from 'lusca';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { HttpException } from './exceptions';
import { Controller } from './interfaces';
import errorMiddleware from './middlewares/error.middleware';
import logger from './utils/logger';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      logger.info(
        `${chalk.green('✓')} App is running at http://localhost:${
          process.env.PORT
        } in ${this.app.get('env')} mode`
      );

      logger.info('Press CTRL-C to stop\n');
    });
  }

  private initializeMiddlewares() {
    this.app.use(compression());
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // TODO: See how origin can be set for production.
    this.app.use(cors({ origin: 'http://localhost:3000' }));
    this.app.use(lusca.xframe('SAMEORIGIN'));
    this.app.use(lusca.xssProtection(true));
  }

  private initializeErrorHandling() {
    this.app.use(
      (
        error: HttpException,
        request: express.Request,
        response: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: express.NextFunction
      ) => {
        errorMiddleware(error, request, response);
      }
    );

    this.app.get('/*', function(req, res) {
      res.status(404).send('<h3 style="text-align: center;">Nice try!</h3>');
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use('/api/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );

    mongoose.connection.on('error', () => {
      return logger.error(
        `${chalk.red(
          '✗'
        )} MongoDB connection error. Please make sure MongoDB is running.`
      );
    });
  }
}

export default App;
