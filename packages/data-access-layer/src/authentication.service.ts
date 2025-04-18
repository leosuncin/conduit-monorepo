import { hash } from '@node-rs/argon2';
import { InjectionMode, RESOLVER } from 'awilix';
import Snowflakify from 'snowflakify';
import type { InsertableValues } from 'ts-sql-query/extras/types.js';

import type { Connection } from './connection.js';
import { User } from './users.table.js';

type NewUser = Pick<InsertableValues<User>, 'email' | 'password' | 'username'>;

export class UserDuplicated extends Error {
  constructor(cause: Error, data: NewUser) {
    const message = cause.message.includes('email_unique')
      ? `The email ${data.email} is already registered`
      : `The username ${data.username} is already registered`;

    super(message, { cause });
  }
}

export class AuthenticationService {
  #table = new User();
  #snowflake = new Snowflakify();
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  static [RESOLVER] = {
    injectionMode: InjectionMode.CLASSIC,
    name: 'authenticationService',
  };

  async register(newUser: NewUser) {
    try {
      const user = await this.#connection
        .insertInto(this.#table)
        .values({
          ...newUser,
          password: await hash(newUser.password),
          id: this.#snowflake.nextId() as unknown as `user_${string}`,
        })
        .returning({
          id: this.#table.id,
          email: this.#table.email,
          username: this.#table.username,
          bio: this.#table.bio,
          image: this.#table.image,
        })
        .executeInsertOne();

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio ?? null,
        image: user.image ?? null,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('unique constraint')
      ) {
        throw new UserDuplicated(error, newUser);
      }

      throw error;
    }
  }
}
