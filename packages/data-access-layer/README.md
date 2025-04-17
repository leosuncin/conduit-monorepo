# Data Access Layer

Data Access Layer is a Node.js library for interacting with the database.

## Installation

Use the package manager [pnpm](https://pnpm.io/pnpm-cli) to install `@conduit/data-access-layer`.

```bash
pnpm add @conduit/data-access-layer postgres
```

## Usage

```javascript
import { createConnection } from '@conduit/data-access-layer';
import postgres from 'postgres';

const sql = postgres({ ... });
const connection = createConnection(sql);
```

**With [awilix](https://github.com/jeffijoe/awilix)**

```typescript
import { createConnection, loadServices } from '@conduit/data-access-layer';
import { asFunction, asValue, createContainer } from 'awilix';

const sql = postgres({ ... });
const container = createContainer({
  strict: true,
});

container
  .register('sql', asValue(sql))
  .register('connection', asFunction(createConnection, {
      injectionMode: InjectionMode.CLASSIC,
      lifetime: Lifetime.SINGLETON,
    }));

await loadServices(container);
```
