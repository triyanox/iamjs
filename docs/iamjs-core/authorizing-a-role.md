# Authorizing a role

The `AuthManager` class exposes `authorizeRole` method that can be used to authorize a role.

The `authorizeRole` method takes an object with the following properties.

| Property        | Type                        | Description                                                 |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `role`          | `string`                    | The name of the role.                                       |
| `resource`      | `string or [string]`        | The name of the resource or an array of resources.          |
| `action`        | `string or [string]`        | The name of the action or an array of actions.              |
| `constructRole` | `boolean`                   | A flag to construct the role if it doesn't exist.           |
| `permissions`   | `{ [key: string]: string }` | An object containing the permissions to construct the role. |
| `loose`         | `boolean`                   | A flag to allow loose authorization.                        |

Example:

```ts
import { AuthManager, Role } from '@iamjs/core';

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

authManager.authorizeRole({
  resource: 'user',
  action: ['create', 'read'],
  constructRole: true,
  permissions : role.toObject(),
}); // true
```
