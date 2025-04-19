import { type Static, Type } from '@sinclair/typebox';

import { usernameRegex } from './user.js';

export const Register = Type.Object(
  {
    email: Type.String({
      description: 'The email of the new user',
      format: 'email',
    }),
    password: Type.String({
      description: 'The password of the new user',
      format: 'password',
      maxLength: 71,
      minLength: 12,
    }),
    username: Type.String({
      description: 'The username of the new user',
      minLength: 4,
      pattern: usernameRegex.source,
    }),
  },
  {
    $id: 'Register',
    description: 'The details of the new user.',
    title: 'Register',
  }
);

export type Register = Static<typeof Register>;
