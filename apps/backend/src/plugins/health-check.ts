import { hostname } from 'node:os';

import fastifyHealthCheck from 'fastify-custom-healthcheck';
import { fastifyPlugin } from 'fastify-plugin';
import { readPackage } from 'read-pkg';

declare global {
  // biome-ignore lint/style/noNamespace: module augmentation
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
    }
  }
}

const pkg = await readPackage();

export const options: fastifyHealthCheck.CustomHealthCheckOptions = {
  exposeFailure: true,
  info: {
    description: pkg.description as string,
    environment: process.env.NODE_ENV ?? 'development',
    name: pkg.name,
    version: pkg.version,
    hostname: hostname(),
  },
};

export default fastifyPlugin(
  (fastify, opts, done) => {
    fastify.register(
      // @ts-expect-error invalid type
      fastifyHealthCheck,
      Object.assign(structuredClone(options), opts)
    );

    done();
  },
  { name: 'health-check' }
);
