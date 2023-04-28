# Authorization

You can use the `KoaRoleManager` to authorize a request in your koa application by creating a new instance and using the `authorize` method.

The `KoaRoleManager` constructor accepts an object with the following properties:

* `roles` - An object containing the roles that can be used to authorize a request.
* `resources` - A resource or an array of resources being accessed by the user.

Example:

```ts
import { Role } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';
import Router from 'koa-router';
import koa from 'koa';

const app = new Koa();

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
  {
    resource: 'post',
    scopes: 'crudl',
  },
]);

const router = new Router();

const roleManager = new KoaRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
});

router.get('/post', 
  (ctx, next) => {
    ctx.role = 'user';
    await next();
  },
  roleManager.authorize({
    resource: 'user',
    action: ['read', 'create'],
  }), 
  (ctx) => {
    ctx.body = 'Hello World!';
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```
