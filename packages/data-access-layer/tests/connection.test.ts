import { type TestContext, test } from 'node:test';

import { getDependencyContainer } from './helper.js';

// biome-ignore lint/style/noDoneCallback: it's a test case
test('should connect to the database', async (context: TestContext) => {
  await using container = await getDependencyContainer();

  const result = await container
    .resolve('connection')
    .queryRunner.executeSelectOneColumnOneRow('SELECT 1');

  context.assert.equal(result, 1);
});
