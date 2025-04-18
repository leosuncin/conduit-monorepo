import type { AwilixContainer } from 'awilix';

import type { AuthenticationService } from './authentication.service.js';
import type { Connection } from './connection.js';

export type DependencyCradle = {
  connection: Connection;
  authenticationService: AuthenticationService;
};

export type DependencyContainer = AwilixContainer<DependencyCradle>;
