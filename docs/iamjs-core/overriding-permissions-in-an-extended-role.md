# Overriding permissions in an extended role

The Role class in @iamjs/core allows you to override permissions in an extended role by passing the `overwrite` flag to the `extend` method.

When extending a role with additional permissions, you can pass an object as the second argument to the `extend` method with the following properties:

* `overwrite` (optional): A boolean that determines whether the new permissions should overwrite the existing ones or be merged with them. If set to `true`, the new permissions will completely replace the existing ones. If set to `false` or not provided, the new permissions will be merged with the existing ones.
* `permissions`: An array of permission objects that define the new permissions to be added or the existing permissions to be overridden.

Here's an example of how to override permissions in an extended role:

```javascript
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

In this example, the `overwrite` flag is set to `true`, which means that the new permissions completely replace the existing ones. The resulting `extendedRole` instance has permissions that allow creating, reading, updating, deleting, and listing the 'user' resource.

If the `overwrite` flag is not provided or set to `false`, the new permissions will be merged with the existing ones. For example:

```javascript
const extendedRole = new Role().extend(role, {
  permissions: [
    {
      resource: 'user',
      scopes: 'crudl',
    },
  ],
});

console.log(extendedRole.canCreate('user')); // true
console.log(extendedRole.canUpdate('user')); // true
console.log(extendedRole.canDelete('user')); // false
```

In this case, the `extendedRole` instance has permissions that allow creating, reading, and updating the 'user' resource, but not deleting it, because the existing permissions were not overwritten.
