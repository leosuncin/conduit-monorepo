import * as path from 'node:path';

import { type AutoloadPluginOptions, fastifyAutoload } from '@fastify/autoload';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyPluginCallback } from 'fastify';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
export const options: AppOptions = {};

const app: FastifyPluginCallback<AppOptions> = (fastify, opts, done) => {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .register(fastifyAutoload, {
      dir: path.join(import.meta.dirname, 'plugins'),
      options: opts,
      forceESM: true,
    })
    .register(fastifyAutoload, {
      dir: path.join(import.meta.dirname, 'routes'),
      options: opts,
      forceESM: true,
      routeParams: true,
    });

  done();
};

export default app;
