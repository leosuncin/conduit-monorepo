import { type Static, Type } from '@sinclair/typebox';

export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]+$/;

export const User = Type.Object(
  {
    email: Type.String({
      description: 'The email of the user',
      format: 'email',
    }),
    username: Type.String({
      description: 'The username of the user',
      minLength: 4,
      pattern: usernameRegex.source,
    }),
    bio: Type.Union(
      [
        Type.Null(),
        Type.String({
          minLength: 1,
        }),
      ],
      {
        description: 'The biography of the user',
      }
    ),
    image: Type.Union(
      [
        Type.Null(),
        Type.String({
          minLength: 1,
          format: 'uri',
        }),
      ],
      {
        description: 'The avatar of the user',
      }
    ),
  },
  { $id: 'User' }
);

export type User = Static<typeof User>;
