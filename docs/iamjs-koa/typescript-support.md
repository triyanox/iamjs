# Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `authorize` method accepts a generic type which can be used to define the type of the request or response object.

Example:

```ts
import { Role } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';
import koa, { Context, Next } from 'koa';
import Router from 'koa-router';

const app = koa();
const router = new Router();  

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

interface CustomContext extends Context {
  role: string;
  permissions: Record<string, string>;
}

const roleManager = new KoaRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
  onSuccess : <CustomContext>(ctx, next) => {
    ctx.body = 'Hello World!';
  },
  onError: <CustomContext>(err, ctx, next) => {
    ctx.status = 403;
    ctx.body = 'Forbidden';
  },
});

const auth = async (ctx: CustomContext, next: Next) => {
  ctx.role = 'user';
  ctx.permissions = role.toObject();
  await next();
};

router.get('/post', 
  auth,
  roleManager.authorize<CustomContext>({
    roleKey: 'role',
    resource: 'user',
    action: ['read', 'create'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  }), 
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

app.use(router.routes());

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```
