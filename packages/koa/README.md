# `@iamjs/koa`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

This package contains the koa middleware for iamjs a library for easy role and permissions management for your koa application.

## Installation

```bash
npm install @iamjs/core @iamjs/koa
# or
yarn add @iamjs/core @iamjs/koa
# or
pnpm add @iamjs/core @iamjs/koa
# or
bun add @iamjs/core @iamjs/koa
```

## Usage

### Authorization

You can use the `KoaRoleManager` to authorize a request in your koa application by creating a new instance and using the `check` method.

Example:

```ts
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/koa';
import Koa from 'koa';
import Router from 'koa-router';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl'
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    await next();
  },
  async onSuccess(ctx, next) {
    ctx.status = 200;
    ctx.body = 'Hello World from the success handler!';
    await next();
  }
});

router.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.use(router.routes());
```
### Advanced Usage

By using the `construct` option you can use the data from the request to build the role from its own permissions.

```ts
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/koa';
import Koa from 'koa';
import Router from 'koa-router';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl'
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    await next();
  },
  async onSuccess(ctx, next) {
    ctx.status = 200;
    ctx.body = 'Hello World from the success handler!';
    await next();
  }
});

router.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    strict: true,
    // get the role json or object from the request
    data: async (ctx) => {
      return ctx.permissions
    }
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.use(router.routes());
```
### Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `KoaRoleManager` constructor to handle the success and error cases.

Example:

```typescript
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/koa';
import Koa from 'koa';
import Router from 'koa-router';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl'
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    await next();
  },
  async onSuccess(ctx, next) {
    ctx.status = 200;
    ctx.body = 'Hello World from the success handler!';
    await next();
  }
});

router.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.use(router.routes());
```

### Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `check` method accepts a generic type which can be used to define the type of the context object.

Example:

```ts
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/koa';
import Koa from 'koa';
import Router from 'koa-router';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl'
    }
  }
});

const schema = new Schema({
  roles : { role }
});

interface CustomContext extends Context {
  somekey: any
}

const roleManager = new KoaRoleManager({
  schema,
  async onError<CustomContext>(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    await next();
  },
  async onSuccess<CustomContext>(ctx, next) {
    ctx.status = 200;
    ctx.body = 'Hello World from the success handler!';
    await next();
  }
});

router.get(
  '/resource1',
  roleManager.check<CustomContext>({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.use(router.routes());
```

### Save users activity

You can save user activity using the `onActivity` method on the **KoaRoleManager**

```typescript
import { Role, Schema } from "@iamjs/core";
import { ExpressRoleManager } from "@iamjs/koa";
import Koa from "koa";
import Router from "koa-router";

const role = new Role({
  name: "role",
  config: {
    resource1: {
      base: "crudl",
    },
    resource2: {
      base: "cr-dl",
    },
  },
});

const schema = new Schema({
  roles: { role },
});

interface CustomContext extends Context {
  somekey: any;
}

const roleManager = new KoaRoleManager({
  schema,
  async onError<CustomContext>(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = "Forbidden";
    await next();
  },
  async onSuccess<CustomContext>(ctx, next) {
    ctx.status = 200;
    ctx.body = "Hello World from the success handler!";
    await next();
  },
  async onActivity(data) {
    // save the activity object
  },
});

router.get(
  "/resource1",
  roleManager.check<CustomContext>({
    resources: "resource1",
    actions: ["create", "update"],
    role: "role",
    strict: true,
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.use(router.routes());
```

The data object contains:

| Name       | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| actions?   | The action or actions that are authorized to be executed on the resource |
| resources? | The resource or resources that are authorized to be accessed             |
| role?      | The role that is used to authorize the request                           |
| success?   | The status of the request                                                |
| ctx?       | The context object                                                       |

