import { Table } from 'ts-sql-query/Table.js';

import type { Connection } from './connection.js';

export class User extends Table<Connection, 'users'> {
  id = this.primaryKey<`user_${string}`>(
    'user_id',
    'customComparable',
    'ID:user'
  );
  email = this.column('user_email', 'string');
  password = this.column('user_password', 'string');
  username = this.column('user_username', 'string');
  bio = this.optionalColumn('user_bio', 'string');
  image = this.optionalColumn('user_image', 'string');

  constructor() {
    super('users');
  }
}
