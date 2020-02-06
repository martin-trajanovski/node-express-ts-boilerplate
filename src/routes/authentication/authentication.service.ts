import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
  HttpException,
  UserWithThatEmailAlreadyExistsException,
  WrongCredentialsException,
} from '@src/exceptions';
import {
  DataStoredInToken,
  TokenData,
  User,
  LoginActivity,
} from '@src/interfaces';
import { userModel } from '@src/models';

import CreateUserDto from '../user/user.dto';
import LogInDto from './login.dto';
// import TokenList from '../../interfaces/tokenList.interface';

// TODO: Use redis (in memory storage) which is better for production.
// Define the type of tokenList correctly!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tokenList: any = {};

class AuthenticationService {
  private user = userModel;

  public async register(userData: CreateUserDto) {
    if (await this.user.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({
      ...userData,
      password: hashedPassword,
    });
    user.password = '';

    return {
      user,
    };
  }

  public async login(logInData: LogInDto) {
    const user = await this.user.findOne({ email: logInData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );

      if (isPasswordMatching) {
        user.password = '';
        const authToken = this.createToken(user);
        const refreshToken = await this.createRefreshToken(user);
        await this.logUserActivity(user, 'login');

        tokenList[refreshToken] = {
          authToken,
          refreshToken,
        };

        return {
          authToken,
          refreshToken,
        };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  }

  public logout(refreshToken: string) {
    if (refreshToken in tokenList) {
      delete tokenList[refreshToken];
    }

    return {
      success: true,
    };
  }

  public refreshToken = async (refreshToken: string) => {
    if (refreshToken in tokenList) {
      const user = await this.validateRefreshToken(refreshToken);
      const authToken = this.createToken(user);

      return authToken;
    } else {
      throw new HttpException(401, 'Refresh token expired - session ended.');
    }
  };

  private validateRefreshToken = async (refreshToken: string) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;

    try {
      jwt.verify(refreshToken, secret);
    } catch (error) {
      this.logout(refreshToken);

      throw new HttpException(401, 'Refresh token expired - session ended.');
    }

    try {
      const user = await this.user.findOne({ refreshToken });

      return user;
    } catch (error) {
      throw new HttpException(500, 'Something went wrong!');
    }
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const expiresInMS = expiresIn * 1000;
    const expiresAt = new Date(Date.now() + expiresInMS).getTime();
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    return {
      expiresAt,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private async createRefreshToken(user: User): Promise<string> {
    const expiresIn = 60 * 60 * 60; // a day
    const secret = process.env.REFRESH_TOKEN_SECRET;

    const refreshToken = jwt.sign({ type: 'refresh' }, secret, {
      expiresIn, // 1 day
    });

    await this.user.findOneAndUpdate({ email: user.email }, { refreshToken });

    // TODO: Update all depredated mongoose functions. There are warnings in the console, check them all!
    return refreshToken;
  }

  public logUserActivity = (user: User, activity: string) => {
    return LoginActivity.create({ userID: user._id, activityType: activity });
  };
}

export default AuthenticationService;
