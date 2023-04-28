# Extending a role

`iamjs/core` exports a `Role` class that can be used to extend a role with a set of permissions.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

const extendedRole = role.extend(role);

console.log(extendedRole.canCreate('user')); // true
console.log(extendedRole.canUpdate('user')); // false
```

and you can additional permissions to the role using `addPermissions` method.

```ts
import { Role } from '@iamjs/core';

extendedRole.addPermissions([
  {
    resource: 'post',
    scopes: 'crudl',
  },
]);
```

or you can pass the permissions to the constructor.

```ts
const extendedRole = role.extend(role, [
  {
    resource: 'post',
    scopes: 'crudl',
  },
]);
```
