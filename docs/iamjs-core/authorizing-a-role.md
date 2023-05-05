# Authorizing a role

The AuthManager class exposes the `authorizeRole` method that can be used to authorize a role. This method takes an object with the following properties:

* `role`: the name of the role to authorize.
* `resource`: the name of the resource to authorize the role for.
* `action`: the action or actions to authorize. This can be a string or an array of strings.
* `constructRole` (optional): a flag that indicates whether to construct a role object from the permissions associated with the specified role name. Defaults to `false`.
* `permissions` (optional): an object that defines the permissions associated with the role. This is only used when `constructRole` is set to `true`. If not provided, the permissions associated with the specified role name will be used.

Example:

```javascript
javascriptCopy codeimport { AuthManager, Role } from '@iamjs/core';

const authManager = new AuthManager({
  roles: {
    admin: new Role([
      {
        resource: 'user',
        scopes: 'crudl',
      },
    ]),
    user: new Role([
      {
        resource: 'user',
        scopes: 'crud',
      },
    ]),
  },
  resources: ['user'],
});

authManager.authorizeRole({
  role: 'admin',
  resource: 'user',
  action: 'create',
}); // true

const role = new Role([
  {
    resource: 'user',
    scopes: 'crud',
  },
]);

authManager.authorizeRole({
  resource: 'user',
  action: ['create', 'read'],
  constructRole: true,
  permissions: role.toObject(),
}); // true
```

Note that when `constructRole` is set to `true`, the `permissions` object should be generated from a role object using the `toObject` method.
