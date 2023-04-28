# Success and Error Handling

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
    user: role,
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
