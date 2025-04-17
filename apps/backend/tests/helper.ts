import * as path from 'node:path';

import { IntegreSQLClient } from '@devoxa/integresql-client';
import { execa } from 'execa';
import type { FastifyInstance } from 'fastify';
import helper from 'fastify-cli/helper.js';

declare global {
  // biome-ignore lint/style/noNamespace: module augmentation
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      INTEGRESQL_URL?: string;
    }
  }
}

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});
const AppPath = path.join(import.meta.dirname, '..', 'src', 'app.ts');
const hash = await client.hashFiles(['../../../migrations/*.sql']);

await client.initializeTemplate(hash, async (databaseConfig) => {
  await execa({
    stdout: { file: 'node_modules/output.txt' },
    stderr: { file: 'node_modules/error.txt' },
  })`migrate -path=${path.join(import.meta.dirname, '..', '..', '..', 'migrations')} -database=${client.databaseConfigToConnectionUrl({ ...databaseConfig, host: process.env.POSTGRES_HOST ?? 'localhost' })}?sslmode=disable up`;
});

// Fill in this config with all the configurations
// needed for testing the application
export async function config(): Promise<Record<string, unknown>> {
  const databaseConfig = await client.getTestDatabase(hash);

  return {
    skipOverride: true, // Register our application with fastify-plugin
    database: databaseConfig.database,
    host: process.env.POSTGRES_HOST ?? 'localhost',
    password: databaseConfig.password,
    port: 5432,
    username: databaseConfig.username,
  };
}

// Automatically build and tear down our instance
export async function build(): Promise<FastifyInstance & AsyncDisposable> {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const options = await config();
  const app: FastifyInstance = await helper.build(argv, options);
  // const app: FastifyInstance = await helper.build(argv, { skipOverride: true });

  await app.ready();

  return Object.assign(app, {
    [Symbol.asyncDispose]: async () => {
      await app.close();
    },
  });
}
