# Authorization

You can use the `ExpressRoleManager` to authorize a request in your express application by creating a new instance and using the `authorize` method.

The `ExpressRoleManager` constructor accepts an object with the following properties:

* `roles` - An object containing the roles that can be used to authorize a request.
* `resources` - A resource or an array of resources being accessed by the user.

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
