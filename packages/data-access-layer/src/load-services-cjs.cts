import type { AwilixContainer } from 'awilix';

import type { DependencyContainer } from './types';

export function loadServices<
  Container extends AwilixContainer = DependencyContainer,
>(container: Container): Promise<Container> {
  return Promise.resolve(
    container.loadModules(['**/*.service.{js,ts}'], { cwd: __dirname })
  );
}
