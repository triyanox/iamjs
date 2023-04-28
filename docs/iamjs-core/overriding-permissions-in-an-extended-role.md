# Overriding permissions in an extended role

You can override permissions in an extended role by passing the `override` flag to the `extend` method.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

const extendedRole = new Role().extend(role, {
  overwrite: true,
  permissions: [
    {
      resource: 'user',
      scopes: 'crudl',
    },
  ],
});

console.log(extendedRole.canCreate('user')); // true
console.log(extendedRole.canUpdate('user')); // true
console.log(extendedRole.canDelete('user')); // true
```
