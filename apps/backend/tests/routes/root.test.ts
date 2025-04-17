import { type TestContext, test } from 'node:test';

import { StatusCodes } from 'http-status-codes';

import { build } from '../helper.js';

// biome-ignore lint/style/noDoneCallback: it's a test case
test('greet route', async (context: TestContext) => {
  await using app = await build();

  const response = await app.inject({
    url: '/greet',
  });

  context.assert.equal(response.statusCode, StatusCodes.OK);
  context.assert.deepStrictEqual(response.json(), {
    message: 'Hello, world!',
  });
});
