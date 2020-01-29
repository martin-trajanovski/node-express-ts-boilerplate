import { Schema, model, Document } from 'mongoose';

import { Todo } from '@src/interfaces';

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export const todoModel = model<Todo & Document>('todos', todoSchema);
