import { type FastifyCookieOptions, fastifyCookie } from '@fastify/cookie';
import { fastifyPlugin } from 'fastify-plugin';

import { generateRandomString } from '../utils/generate-random-string.js';

declare global {
  // biome-ignore lint/style/noNamespace: module augmentation
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET?: string;
    }
  }
}

export const autoConfig: FastifyCookieOptions = {
  secret: process.env.COOKIE_SECRET ?? generateRandomString(32),
  hook: 'onRequest',
};

export default fastifyPlugin<FastifyCookieOptions>((fastify, opts, done) => {
  fastify.register(fastifyCookie, opts);

  done();
});
