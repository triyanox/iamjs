# Typescript Support

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
