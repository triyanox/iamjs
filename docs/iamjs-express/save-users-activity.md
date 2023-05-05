# Save users activity

You can save user activity using the `onActivity` method on the **ExpressRoleManager**

```typescript
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
  async onActivity(data) {
   // save the activity
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

The data object contains:

| Name      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| action?   | The action or actions that are authorized to be executed on the resource |
| resource? | The resource or resources that are authorized to be accessed             |
| role?     | The role that is used to authorize the request                           |
| success?  | The status of the request                                                |
| req?      | The request object                                                       |

&#x20;
