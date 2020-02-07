import { Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
  address?: {
    city: string;
    country: string;
    street: string;
  };
}
