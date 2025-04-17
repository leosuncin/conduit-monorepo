import {
  type FastifyPluginCallbackTypebox,
  Type,
} from '@fastify/type-provider-typebox';

const root: FastifyPluginCallbackTypebox = (fastify, _, done) => {
  fastify.get(
    '/greet',
    {
      schema: {
        querystring: Type.Object({
          name: Type.String({ default: 'world' }),
        }),
        response: {
          200: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    (request, reply) => {
      const { name } = request.query;

      reply.send({ message: `Hello, ${name}!` });
    }
  );

  done();
};

export default root;
