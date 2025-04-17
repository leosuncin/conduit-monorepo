#!/bin/env node
import { format } from 'node:util';

import { StatusCodes } from 'http-status-codes';

async function healthCheck() {
  const controller = new AbortController();
  const port = process.env.PORT ?? 3000;

  setTimeout(() => {
    controller.abort('Request timeout');
  }, 1_000);

  const response = await fetch(`http://localhost:${port}/health`, {
    signal: controller.signal,
  });
  process.stdout.write(`CODE: ${response.status}\n`);
  process.stdout.write(`STATUS: ${response.statusText}\n`);
  process.stdout.write(JSON.stringify(await response.json(), null, 2));

  process.exit(response.status === StatusCodes.OK ? 0 : 1);
}

try {
  healthCheck();
} catch (error) {
  process.stderr.write(`ERROR: ${format(error)}\n`);
  process.exit(1);
}
