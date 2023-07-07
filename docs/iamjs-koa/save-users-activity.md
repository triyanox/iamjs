# Save users activity

You can save user activity using the `onActivity` method on the **KoaRoleManager**

```typescript
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
  },
  async onActivity(data){
  // save the activity object
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

The data object contains:

<table><thead><tr><th width="230.5">Name</th><th>Description</th></tr></thead><tbody><tr><td>actions?</td><td>The action or actions that are authorized to be executed on the resource</td></tr><tr><td>resources?</td><td>The resource or resources that are authorized to be accessed</td></tr><tr><td>role?</td><td>The role that is used to authorize the request</td></tr><tr><td>success?</td><td>The status of the request</td></tr><tr><td>ctx?</td><td>The context object</td></tr></tbody></table>

&#x20;
