import { Schema, model, Document } from 'mongoose';

import { User } from '@src/interfaces';

const addressSchema = new Schema({
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  street: {
    type: String,
    default: '',
  },
});

const userSchema = new Schema({
  address: addressSchema,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: '',
  },
});

export const userModel = model<User & Document>('users', userSchema);
