import {
  type FastifyDynamicSwaggerOptions,
  fastifySwagger,
} from '@fastify/swagger';
import { fastifyPlugin } from 'fastify-plugin';

export const options: FastifyDynamicSwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'RealWorld Conduit API',
      contact: {
        name: 'RealWorld',
        url: 'https://realworld-docs.netlify.app/',
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
      version: '1.0.0',
      summary: 'Conduit API documentation',
      description: 'This is the API definition for the RealWorld Conduit API.',
    },
  },
};

/**
 * This plugins generate an OpenAPI 3 document from the routes
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fastifyPlugin<FastifyDynamicSwaggerOptions>(
  (fastify, opts, done) => {
    fastify.register(
      fastifySwagger,
      Object.assign(structuredClone(options), opts)
    );

    done();
  },
  { name: 'swagger' }
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;
  }
}
