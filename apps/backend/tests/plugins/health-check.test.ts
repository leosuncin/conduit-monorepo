import { type TestContext, test } from 'node:test';

import { StatusCodes } from 'http-status-codes';

import { build } from '../helper.js';

// biome-ignore lint/style/noDoneCallback: it's a test case
test('health check', async (context: TestContext) => {
  await using app = await build();

  const response = await app.inject({
    url: '/health',
  });
  const json = response.json();

  context.assert.equal(response.statusCode, StatusCodes.OK);
  context.assert.ok(Object.hasOwn(json, 'healthChecks'));
  context.assert.ok(Object.hasOwn(json, 'info'));
  context.assert.ok(Object.hasOwn(json, 'stats'));
});
