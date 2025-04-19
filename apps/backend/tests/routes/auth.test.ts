import { type TestContext, describe, it } from 'node:test';

import { StatusCodes } from 'http-status-codes';

import type { Register } from '../../src/json-schemas/register.js';
import type { User } from '../../src/json-schemas/user.js';
import { build } from '../helper.js';

describe('Authentication routes', () => {
  // biome-ignore lint/style/noDoneCallback: it's a test case
  it('register a new user', async (context: TestContext) => {
    await using app = await build();
    const newUser: Register = {
      email: 'jaren43@yahoo.com',
      password: 'Th3Pa$$w0rd!',
      username: 'jaren43',
    };
    const response = await app.inject().post('/auth/register').body(newUser);
    const user: User = response.json();

    context.assert.ok('set-cookie' in response.headers);
    context.assert.equal(response.statusCode, StatusCodes.ACCEPTED);
    context.assert.ok(!Object.hasOwn(user, 'password'));
    context.assert.equal(user.email, newUser.email);
    context.assert.equal(user.username, newUser.username);
    context.assert.equal(user.bio, null);
    context.assert.equal(user.image, null);
  });

  describe('validate the body', () => {
    // biome-ignore lint/style/noDoneCallback: it's a test case
    it('require the body', async (context: TestContext) => {
      await using app = await build();
      const response = await app.inject().post('/auth/register');

      context.assert.equal(response.statusCode, StatusCodes.BAD_REQUEST);
      context.assert.snapshot(response.json());
    });

    // biome-ignore lint/style/noDoneCallback: it's a test case
    it('require the username', async (context: TestContext) => {
      await using app = await build();
      const response = await app
        .inject()
        .post('/auth/register')
        .body({ email: 'jaren43@yahoo.com', password: 'Th3Pa$$w0rd!' });

      context.assert.equal(response.statusCode, StatusCodes.BAD_REQUEST);
      context.assert.snapshot(response.json());
    });

    // biome-ignore lint/style/noDoneCallback: it's a test case
    it('require the password', async (context: TestContext) => {
      await using app = await build();
      const response = await app
        .inject()
        .post('/auth/register')
        .body({ email: 'jaren43@yahoo.com', username: 'jaren43' });

      context.assert.equal(response.statusCode, StatusCodes.BAD_REQUEST);
      context.assert.snapshot(response.json());
    });

    // biome-ignore lint/style/noDoneCallback: it's a test case
    it('require the password', async (context: TestContext) => {
      await using app = await build();
      const response = await app
        .inject()
        .post('/auth/register')
        .body({ password: 'Th3Pa$$w0rd!', username: 'jaren43' });

      context.assert.equal(response.statusCode, StatusCodes.BAD_REQUEST);
      context.assert.snapshot(response.json());
    });
  });

  // biome-ignore lint/style/noDoneCallback: it's a test case
  it('avoid to register a duplicated user', async (context: TestContext) => {
    await using app = await build();
    const newUser: Register = {
      email: 'leonard.jacobson@gmail.com',
      password:
        'Esse ea magna adipisicing fugiat culpa aut aliquip ad.+Ar1eFuwfSr1ivj==',
      username: 'leonard.jacobson',
    };
    await app.diContainer.resolve('authenticationService').register(newUser);
    const responses = await Promise.all([
      app
        .inject()
        .post('/auth/register')
        .body({ ...newUser, username: 'Idell59' }),
      app
        .inject()
        .post('/auth/register')
        .body({ ...newUser, email: 'Magdalena.Heathcote@gmail.com' }),
    ]);

    context.assert.equal(
      responses[0].statusCode,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
    context.assert.equal(
      responses[1].statusCode,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  });
});
