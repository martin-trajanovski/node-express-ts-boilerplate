import { Types } from 'mongoose';

export interface Todo {
  _id: Types.ObjectId;
  title: string;
  completed: boolean;
}
