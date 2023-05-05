# Save users activity

You can save user activity using the `onActivity` method on the **KoaRoleManager**

```typescript
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
  async onActivity(data) {
   // save the activity
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

The data object contains:

| Name      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| action?   | The action or actions that are authorized to be executed on the resource |
| resource? | The resource or resources that are authorized to be accessed             |
| role?     | The role that is used to authorize the request                           |
| success?  | The status of the request                                                |
| ctx?      | The context object                                                       |

&#x20;
