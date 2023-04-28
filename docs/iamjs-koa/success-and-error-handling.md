# Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `KoaRoleManager` constructor to handle the success and error cases.

Example:

```ts
import { Role } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';
import koa from 'koa';
import Router from 'koa-router';

const app = koa();

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

const roleManager = new KoaRoleManager({
  roles: {
    user: role,
  },
  resources: ['post', 'post'],
  onError: (err, ctx, next) => {
    ctx.status = 403;
    ctx.body = 'Forbidden';
  },
  onSucess: (ctx, next) => {
    ctx.body = 'Hello World!';
  },
});

const router = new Router();

const auth = async (ctx, next) => {
  ctx.role = 'user';
  ctx.permissions = role.toObject();
  await next();
},

router.get('/post', 
  auth,
  roleManager.authorize({
    roleKey: 'role',
    resource: 'user',
    action: ['read', 'create'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  }), 
  (ctx) => {
    ctx.body = 'Hello World!';
});

app.use(router.routes());

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```
