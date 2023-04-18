<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# `iamjs/koa`

This package contains the koa middleware for iamjs a library for easy role and permissions management for your koa application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Authorization](#authorization)
  - [Advanced Usage](#advanced-usage)
  - [Success or Error Handling](#success-and-error-handling)
  - [TypeScript support](#typescript-support)
- [License](#license)

## Installation

```bash
npm install @iamjs/core @iamjs/koa 
```

or

```bash
yarn add @iamjs/core @iamjs/koa 
```

## Usage

### Authorization

You can use the `KoaRoleManager` to authorize a request in your koa application by creating a new instance and using the `authorize` method.

The `KoaRoleManager` constructor accepts an object with the following properties:

- `roles` - An object containing the roles that can be used to authorize a request.
- `resources` - A resource or an array of resources being accessed by the user.

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

### Advanced Usage

The `authorize` method accepts an object with the following properties:

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `roleKey` | `string` | The key to use to get the role from the request. | `'role'` |
| `resource` | `string` | The resource being accessed by the user. | `undefined` |
| `action` | `string` \| `string[]` | The action being performed on the resource. | `undefined` |
| `usePermissionKey` | `boolean` | Whether to use the `permissionKey` to get the permission from the request. | `false` |
| `permissionKey` | `string` | The key to use to get the permission from the request. | `'permissions'` |
| `loose` | `boolean` | Whether to use loose mode. | `false` |

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

### Success and Error Handling

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

### Typescript Support

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

## License

[MIT](https://github.com/triyanox/iamjs/blob/main/LICENSE)
