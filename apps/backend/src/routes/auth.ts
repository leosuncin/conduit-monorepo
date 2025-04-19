import {
  type FastifyPluginCallbackTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { StatusCodes } from 'http-status-codes';

import { UserDuplicated } from '@conduit/data-access-layer';
import { Register } from '../json-schemas/register.js';
import { User } from '../json-schemas/user.js';

export const autoPrefix = '/auth';

const auth: FastifyPluginCallbackTypebox = (fastify, _, done) => {
  fastify.addSchema(Register).addSchema(User);

  fastify.post(
    '/register',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Creating a new user',
        description: 'Register a new user',
        operationId: 'AuthRegister',
        body: Type.Unsafe<Register>(Type.Ref(Register.$id as 'Register')),
        response: {
          [StatusCodes.ACCEPTED]: Type.Unsafe<User>(
            Type.Ref(User.$id as 'User')
          ),
        },
      },
      errorHandler(error, _request, reply) {
        if (error instanceof UserDuplicated) {
          throw reply.unprocessableEntity(error.message);
        }

        throw error;
      },
    },
    async (request, reply) => {
      const user =
        await fastify.diContainer.cradle.authenticationService.register(
          request.body
        );

      return reply.status(StatusCodes.ACCEPTED).sendAuthentication(user);
    }
  );

  done();
};

export default auth;
