# Creating an authorization manager

`iamjs/core` exports a `AuthManager` class that can be used to create a role manager.

The `AuthManager` class constructor takes an object with the following properties.

| Property    | Type                      | Description                     |
| ----------- | ------------------------- | ------------------------------- |
| `roles`     | `{ [key: string]: Role }` | An object containing the roles. |
| `resources` | `[string]`                | An array of resources.          |

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
```
