import type { AwilixContainer } from 'awilix';

import type { Connection } from './connection.js';

export type DependencyCradle = {
  connection: Connection;
};

export type DependencyContainer = AwilixContainer<DependencyCradle>;
