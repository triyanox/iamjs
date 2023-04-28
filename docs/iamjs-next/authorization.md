# Authorization

You can use the `NextRoleManager` to authorize a request in your next application by creating a new instance and using the `authorize` method.

The `NextRoleManager` constructor accepts an object with the following properties:

* `roles` - An object containing the roles that can be used to authorize a request.
* `resources` - A resource or an array of resources being accessed by the user.

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
