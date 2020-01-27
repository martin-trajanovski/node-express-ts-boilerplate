import { Request } from 'express';
import { User } from '.';

export interface RequestWithUser extends Request {
  user: User;
}
