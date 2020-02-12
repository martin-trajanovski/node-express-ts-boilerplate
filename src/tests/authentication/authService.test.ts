import faker from 'faker';

import 'dotenv/config';
import {
  UserWithThatEmailAlreadyExistsException,
  WrongCredentialsException,
} from '@src/exceptions';
import AuthenticationService from '@src/routes/authentication/authentication.service';
import CreateUserDto from '@src/routes/user/user.dto';
import testDBHandler from '@src/utils/testDBHandler';

// NOTE: Run the in-memory database.
testDBHandler.run();

const authService = new AuthenticationService();

const fakeUser: CreateUserDto = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
};

describe('authentication.service.ts', () => {
  test('When register method is called with valid params, should return user successfully', async () => {
    const { user } = await authService.register(fakeUser);

    expect(user.email).toBe(fakeUser.email);
  });

  test('When register method is called twice with same email, should throw "user with that email already exists" error', async () => {
    const { user } = await authService.register(fakeUser);

    await expect(authService.register(fakeUser)).rejects.toThrow(
      new UserWithThatEmailAlreadyExistsException(user.email)
    );
  });

  test('When trying to login with wrong credentials, should throw "wrong credentials" error', async () => {
    await expect(
      authService.login({ email: fakeUser.email, password: fakeUser.password })
    ).rejects.toThrow(new WrongCredentialsException());
  });

  test('When trying to login with correct credentials, should return auth and refresh tokens', async () => {
    await authService.register(fakeUser);

    const tokens = await authService.login({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    expect(tokens.authToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  test('When trying to refresh token with correct credentials, should return auth tokens', async () => {
    await authService.register(fakeUser);

    const tokens = await authService.login({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    const authToken = await authService.refreshToken(tokens.refreshToken);

    expect(authToken.token).toBeDefined();
  });
});
