# Typescript Support

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
    user: role,
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
