<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# `iamjs/express`

This package contains the express middleware for iamjs a library for easy role and permissions management for your koa application.

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
npm install @iamjs/core @iamjs/express 
```

or

```bash
yarn add @iamjs/core @iamjs/express 
```

## Usage

### Authorization

You can use the `ExpressRoleManager` to authorize a request in your express application by creating a new instance and using the `authorize` method.

The `ExpressRoleManager` constructor accepts an object with the following properties:

- `roles` - An object containing the roles that can be used to authorize a request.
- `resources` - A resource or an array of resources being accessed by the user.

Example:

```ts
import { Role } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  roles: {
    user,
  },
  resources: ['user', 'post'],
});

app.get('/post',
  (req, res, next) => {
    req.role = 'user';
    next();
  },
  roleManager.authorize({
    resource: 'user',
    action: ['read', 'create'],
  }), 
  (req, res) => {
  res.send('Hello World!');
});

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
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  roles: {
    user,
  },
  resources: ['user', 'post'],
});

const auth = async (req, res, next) => {
  req.role = 'user';
  req.permissions = role.toObject();
  next();
};

app.get('/post', 
  auth,
  roleManager.authorize({
    roleKey: 'role',
    resource: 'user',
    action: ['read', 'create'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  }), 
  (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```

### Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `ExpressRoleManager` constructor to handle the success and error cases.

Example:

```ts
import { Role } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  roles: {
    user,
  },
  resources: ['user', 'post'],
  onSuccess: (req, res, next) => {
    res.send('Hello World!');
  },
  onError: (err, req, res, next) => {
    console.error(err);
    res.status(403).send('Forbidden');
  },
});

const auth = async (req, res, next) => {
  req.role = 'user';
  req.permissions = user.toObject();
  next();
};

app.get('/post', 
  auth,
  roleManager.authorize({
    roleKey: 'role',
    resource: 'user',
    action: ['read', 'create'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  }), 
  (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```

### Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `authorize` method accepts a generic type which can be used to define the type of the request or response object.

Example:

```ts
import { Role } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  roles: {
    user,
  },
  resources: ['user', 'post'],
  onSuccess : <express.Request, express.Response>(req, res, next) => {
    res.send('Hello World!');
  },
  onError: <express.Request, express.Response>(err, req, res, next) => {
      console.error(err);
      res.status(403).send('Forbidden');
  },
});

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.role = 'user';
  req.permissions = user.toObject();
  next();
};

app.get('/post', 
  auth,
  roleManager.authorize<express.Request, express.Response>({
    roleKey: 'role',
    resource: 'user',
    action: ['read', 'create'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  }), 
  (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```

## License

[MIT]('../../../../LICENSE)
