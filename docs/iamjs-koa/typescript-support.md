# Typescript Support

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
      scopes: 'crudl'
    },
    resource2: {
      scopes: 'cr-dl'
    }
  }
});

const schema = new Schema({
  role
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
