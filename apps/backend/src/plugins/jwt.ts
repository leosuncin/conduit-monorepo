import {
  type FastifyJWTOptions,
  type FastifyJwtNamespace,
  fastifyJwt,
} from '@fastify/jwt';
import type { FastifyReply } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import type { User } from '../json-schemas/user.js';
import { generateRandomString } from '../utils/generate-random-string.js';

declare global {
  // biome-ignore lint/style/noNamespace: module augmentation
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET?: string;
    }
  }
}

const ACCESS_TOKEN_COOKIE_NAME = 'ACCESS_TOKEN';

export const autoConfig: FastifyJWTOptions = {
  secret: process.env.JWT_SECRET ?? generateRandomString(32),
  cookie: {
    cookieName: ACCESS_TOKEN_COOKIE_NAME,
    signed: false,
  },
  sign: {
    expiresIn: '30d',
    algorithm: 'HS384',
  },
  verify: {
    algorithms: ['HS384'],
    requiredClaims: ['id'],
  },
};

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'jwt' }> {}

  interface FastifyReply {
    sendAuthentication(user: User): Promise<FastifyReply>;
  }
}

export default fastifyPlugin<FastifyJWTOptions>((fastify, opts, done) => {
  fastify.register(fastifyJwt, opts);

  fastify.decorateReply(
    'sendAuthentication',
    async function (this: FastifyReply, user: User) {
      const token = await this.jwtSign(
        { email: user.email, username: user.username },
        { aud: 'session', sub: 'authenticate' }
      );

      return this.cookie(ACCESS_TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'strict',
      }).send(user);
    }
  );

  done();
});
