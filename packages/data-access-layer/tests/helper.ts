import { resolve } from 'node:path';

import { IntegreSQLClient } from '@devoxa/integresql-client';
import { InjectionMode, asFunction, asValue, createContainer } from 'awilix';
import { $ } from 'execa';
import postgres from 'postgres';

import { createConnection } from '../src/create-connection.js';
import { loadServices } from '../src/load-services.js';
import type { DependencyContainer, DependencyCradle } from '../src/types.js';

const client = new IntegreSQLClient({
  // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature
  url: process.env['INTEGRESQL_URL'] ?? 'http://localhost:5000',
});

const hash = await client.hashFiles(['../../../migrations/*.sql']);

await client.initializeTemplate(hash, async (databaseConfig) => {
  const migrationDir = resolve('..', '..', 'migrations');

  await $`migrate -path=${migrationDir} -database=${client.databaseConfigToConnectionUrl({ ...databaseConfig, host: 'localhost' })}?sslmode=disable up`;
});

export async function getDependencyContainer(): Promise<
  DependencyContainer & AsyncDisposable
> {
  const container = createContainer<DependencyCradle>({
    strict: true,
  });
  const options: postgres.Options<Record<string, postgres.PostgresType>> = {
    ...(await client.getTestDatabase(hash)),
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature
    host: process.env['POSTGRES_HOST'] ?? 'localhost',
    max: 1,
  };
  const sql = postgres(options);

  container.register('sql', asValue(sql)).register(
    'connection',
    asFunction(createConnection, {
      injectionMode: InjectionMode.CLASSIC,
    })
  );
  await loadServices(container);

  return Object.assign(container, {
    async [Symbol.asyncDispose]() {
      await sql.end();
      await container.dispose();
    },
  });
}
