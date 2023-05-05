# Save users activity

You can save user activity using the `onActivity` method on the **NextRoleManager**

```typescript
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
  },
  async onActivity(data) {
   // save the activity
  },
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

The data object contains:

| Name      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| action?   | The action or actions that are authorized to be executed on the resource |
| resource? | The resource or resources that are authorized to be accessed             |
| role?     | The role that is used to authorize the request                           |
| success?  | The status of the request                                                |
| req?      | The request object                                                       |

&#x20;
