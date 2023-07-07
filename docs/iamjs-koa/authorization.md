# Authorization

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
