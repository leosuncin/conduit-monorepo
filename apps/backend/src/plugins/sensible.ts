import {
  type FastifySensibleOptions,
  fastifySensible,
} from '@fastify/sensible';
import { fastifyPlugin } from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fastifyPlugin<FastifySensibleOptions>((fastify, _, done) => {
  fastify.register(fastifySensible, {
    sharedSchemaId: 'http-error',
  });

  done();
});
