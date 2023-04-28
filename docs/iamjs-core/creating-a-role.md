# Creating a role

`iamjs/core` exports a `Role` class that can be used to create a role with a set of permissions.

```ts
import { Role } from '@iamjs/core';

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

console.log(role.canCreate('user')); // true
console.log(role.canRead('user')); // true
console.log(role.canUpdate('user')); // false
console.log(role.can('create', 'user')); // true
```
