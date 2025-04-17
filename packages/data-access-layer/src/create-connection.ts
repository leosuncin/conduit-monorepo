import type { Sql } from 'postgres';
import { PostgresQueryRunner } from 'ts-sql-query/queryRunners/PostgresQueryRunner.js';

import { Connection } from './connection.js';

export function createConnection(sql: Sql) {
  const queryRunner = new PostgresQueryRunner(sql);
  return new Connection(queryRunner);
}
