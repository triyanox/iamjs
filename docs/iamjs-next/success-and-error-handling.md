# Success and Error Handling

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
