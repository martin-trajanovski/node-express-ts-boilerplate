import { HttpException } from '@src/exceptions';
import { User } from '@src/interfaces';
import { userModel } from '@src/models';

class UsersService {
  private users = userModel;

  public async getAll(): Promise<User[]> {
    try {
      const result = await this.users.find({}, '-password -refreshToken');

      return result;
    } catch (error) {
      throw new HttpException(500, 'Something went wrong');
    }
  }
}

export default UsersService;
