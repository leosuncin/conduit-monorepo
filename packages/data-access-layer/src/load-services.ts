import type { AwilixContainer } from 'awilix';

import type { DependencyContainer } from './types.js';

export function loadServices<
  Container extends AwilixContainer = DependencyContainer,
>(container: Container): Promise<Container> {
  return container.loadModules(['**/*.service.{js,ts}'], {
    // @ts-ignore import meta
    cwd: import.meta.dirname,
    esModules: true,
  });
}
