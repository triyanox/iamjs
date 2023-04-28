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
