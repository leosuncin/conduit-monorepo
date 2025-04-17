import fastifyApiReference, {
  type FastifyApiReferenceOptions,
} from '@scalar/fastify-api-reference';
import { fastifyPlugin } from 'fastify-plugin';

export const options: FastifyApiReferenceOptions = {
  configuration: {
    title: 'RealWorld Conduit API',
  },
};

export default fastifyPlugin<FastifyApiReferenceOptions>(
  (fastify, opts, done) => {
    fastify.register(
      fastifyApiReference,
      Object.assign(structuredClone(options), opts)
    );

    done();
  },
  { dependencies: ['swagger'] }
);
