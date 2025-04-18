import { type TestContext, describe, it } from 'node:test';

import { UserDuplicated } from '../src/authentication.service.js';
import { getDependencyContainer } from './helper.js';

const userIdRegex = /^user_/;

describe('AuthenticationService', () => {
  // biome-ignore lint/style/noDoneCallback: it's a test case
  it('register a new user', async (context: TestContext) => {
    await using container = await getDependencyContainer();
    const authenticationService = container.resolve('authenticationService');
    const newUser = {
      email: 'email@example.com',
      password: 'contraseña',
      username: 'username',
    };
    const user = await authenticationService.register(newUser);

    context.assert.ok(user);
    context.assert.match(user.id, userIdRegex);
    context.assert.equal(user.email, newUser.email);
    context.assert.equal(user.username, newUser.username);
  });

  // biome-ignore lint/style/noDoneCallback: it's a test case
  it('avoid to register a duplicate user', async (context: TestContext) => {
    await using container = await getDependencyContainer();
    const authenticationService = container.resolve('authenticationService');
    const newUser = {
      email: 'email@example.com',
      password: 'contraseña',
      username: 'username',
    };
    await authenticationService.register(newUser);

    try {
      await authenticationService.register(newUser);
    } catch (error) {
      context.assert.ok(error instanceof UserDuplicated);
    }
  });
});
