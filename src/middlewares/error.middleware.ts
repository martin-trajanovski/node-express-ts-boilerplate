import { Request, Response } from 'express';
import chalk from 'chalk';
import { HttpException } from '../exceptions';
import logger from '../utils/logger';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const data = error.data || {};

  logger.error(
    `${chalk.red(`✗ ${status}`)} ${message} ${JSON.stringify(data)}`
  );

  response.status(status).send({
    message,
    status,
    data,
  });
}

export default errorMiddleware;
