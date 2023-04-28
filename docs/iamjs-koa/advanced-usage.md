# Advanced Usage

The `authorize` method accepts an object with the following properties:

| Property           | Type                   | Description                                                                | Default         |
| ------------------ | ---------------------- | -------------------------------------------------------------------------- | --------------- |
| `roleKey`          | `string`               | The key to use to get the role from the request.                           | `'role'`        |
| `resource`         | `string`               | The resource being accessed by the user.                                   | `undefined`     |
| `action`           | `string` \| `string[]` | The action being performed on the resource.                                | `undefined`     |
| `usePermissionKey` | `boolean`              | Whether to use the `permissionKey` to get the permission from the request. | `false`         |
| `permissionKey`    | `string`               | The key to use to get the permission from the request.                     | `'permissions'` |
| `loose`            | `boolean`              | Whether to use loose mode.                                                 | `false`         |

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
  resources: ['user', 'post'],
});

const router = new Router();

const auth = async (ctx, next) => {
  ctx.role = 'user';
  ctx.permissions = role.toObject();
  await next();
};

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
  }
);

app.use(router.routes());

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```
