import { Types } from 'mongoose';

export class TodoDto {
  public title: string;
  public completed: boolean;
  public createdBy: Types.ObjectId;
}
