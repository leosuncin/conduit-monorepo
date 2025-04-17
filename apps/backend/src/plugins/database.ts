import {
  type DependencyCradle,
  createConnection,
  loadServices,
} from '@conduit/data-access-layer';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import { InjectionMode, Lifetime, asFunction } from 'awilix';
import { fastifyPlugin } from 'fastify-plugin';
import postgres from 'postgres';

declare global {
  // biome-ignore lint/style/noNamespace: module augmentation
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
    }
  }
}

declare module '@fastify/awilix' {
  interface Cradle extends DependencyCradle {}
}

declare module 'fastify' {
  interface FastifyInstance {
    connection: ReturnType<typeof createConnection>;
  }
}

export const options: postgres.Options<Record<string, postgres.PostgresType>> =
  {
    database: process.env.POSTGRES_DB ?? 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    port: Number.parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER ?? 'postgres',
  };

export default fastifyPlugin<
  postgres.Options<Record<string, postgres.PostgresType>>
>(
  async (fastify, opts) => {
    const sql = postgres(Object.assign(structuredClone(options), opts));

    await fastify.register(fastifyAwilixPlugin, {
      asyncDispose: true,
      asyncInit: true,
      disposeOnClose: true,
      strictBooleanEnforced: true,
    });

    fastify.diContainer.register(
      'connection',
      asFunction(createConnection, {
        injectionMode: InjectionMode.CLASSIC,
        lifetime: Lifetime.SINGLETON,
      }).inject(() => ({ sql }))
    );

    await loadServices(fastify.diContainer);

    fastify.addHealthCheck('database', async () =>
      fastify.diContainer.cradle.connection.queryRunner.executeSelectOneColumnOneRow(
        'SELECT 1'
      )
    );

    fastify.addHook('onClose', async () => {
      try {
        await sql.end();
      } catch (error) {
        fastify.log.error(error, 'Error closing database connection');
      }
    });
  },
  { dependencies: ['health-check'] }
);
