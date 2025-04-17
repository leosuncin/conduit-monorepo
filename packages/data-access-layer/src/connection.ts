import Hashids from 'hashids';
import { PostgreSqlConnection } from 'ts-sql-query/connections/PostgreSqlConnection.js';

export class Connection extends PostgreSqlConnection<'PostgresConnection'> {
  #encrypter = new Hashids();

  protected override transformValueFromDB(
    value: unknown,
    type: string
  ): unknown {
    if (type.startsWith('ID:')) {
      const id = super.transformValueFromDB(value, 'bigint');

      if (typeof id === 'bigint') {
        const prefix = type.replace('ID:', '');

        return `${prefix}_${this.#encrypter.encode(id)}`;
      }
    }

    return super.transformValueFromDB(value, type);
  }

  protected override transformValueToDB(value: unknown, type: string): unknown {
    if (type.startsWith('ID:')) {
      if (typeof value === 'string') {
        const [, hashId] = value.split('_');
        const id = this.#encrypter.decode(hashId as string).at(0);

        return super.transformValueToDB(id, 'bigint');
      }

      if (typeof value === 'bigint') {
        return super.transformValueToDB(value, 'bigint');
      }

      throw new TypeError('Invalid ID type');
    }

    return super.transformValueToDB(value, type);
  }
}
