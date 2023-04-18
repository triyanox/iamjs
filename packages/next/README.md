<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# `iamjs/next`

This package contains the next middleware for iamjs a library for easy role and permissions management for your next application.

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
npm install @iamjs/core @iamjs/next 
```

or

```bash
yarn add @iamjs/core @iamjs/next 
```

## Usage

### Authorization

You can use the `NextRoleManager` to authorize a request in your next application by creating a new instance and using the `authorize` method.

The `NextRoleManager` constructor accepts an object with the following properties:

- `roles` - An object containing the roles that can be used to authorize a request.
- `resources` - A resource or an array of resources being accessed by the user.

Example:

```ts
import { Role } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

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

const roleManager = new NextRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
});

const withAuth = (handler) => {
  return (req, res) => {
    req.role = 'user';
    return handler(req, res);   
  };
};

const handler = roleManager.authorize(
  {
    resource: 'comment',
    action: ['create', 'update'],
  },
  (req, res) => {
    res.status(200).send('Hello World!');
  }
);

export default withAuth(handler);
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

and a next api handler that will be called if the request is authorized.

Example:

```ts
import { Role } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

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

const roleManager = new NextRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
});

const withAuth = (handler) => {
  return (req, res) => {
    req.role = 'user';
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.authorize(
  {
    roleKey: 'role',
    resource: 'comment',
    action: ['create', 'update'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  },
  (req, res) => {
    res.status(200).send('Hello World!');
  }
);

export default withAuth(handler);
```

### Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `NextRoleManager` constructor to handle the success and error cases.

Example:

```ts
import { Role } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

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

const roleManager = new NextRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
  onSuccess: (req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});

const withAuth = (handler) => {
  return (req, res) => {
    req.role = 'user';
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.authorize(
  {
    roleKey: 'role',
    resource: 'comment',
    action: ['create', 'update'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  },
  (req, res) => {
    res.status(200).send('Hello World!');
  }
);

export default withAuth(handler);
```

### Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `authorize` method accepts a generic type which can be used to define the type of the request or response object.

Example:

```ts
import { Role } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next, { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

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

interface Request extends NextApiRequest {
  role: string;
  permissions: Record<string, string>;
}

interface Response extends NextApiResponse {}

const roleManager = new NextRoleManager({
  roles: {
    user: role,
  },
  resources: ['user', 'post'],
  onSuccess: <Request, Response>(req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: <Request, Response>(err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});

const withAuth = (handler: NextApiHandler) => {
  return (req, res) => {
    req.role = 'user';
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.authorize<Request, Response>(
  {
    roleKey: 'role',
    resource: 'comment',
    action: ['create', 'update'],
    usePermissionKey: true,
    permissionKey: 'permissions',
  },
  (req, res) => {
    console.log(req.role); // user
    res.status(200).send('Hello World!');
  }
);

export default withAuth(handler);
```

## License

[MIT](https://github.com/triyanox/iamjs/blob/main/LICENSE)
