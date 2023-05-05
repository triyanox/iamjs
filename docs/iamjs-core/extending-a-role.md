# Extending a role

The Role class in @iamjs/core also provides a way to extend a role with additional permissions. Here's how to do it:

To get started, you need to create a Role instance with the initial set of permissions. In the example code provided, the role instance is created with permissions that allow creating and reading the 'user' resource.

To extend this role with additional permissions, you can call the extend() method on the role instance and pass another Role instance or an array of permissions as an argument. The extend() method returns a new Role instance that includes the permissions of both the original role and the extended role.

In the example code provided, the role is extended with permissions that allow creating, reading, updating, deleting, and listing the 'post' resource. The resulting extendedRole instance includes all the permissions of the original role and the extended role.

Here's an example of how to extend a role with an additional set of permissions:

```javascript
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

const extendedRole = role.extend(role, [
  {
    resource: 'post',
    scopes: 'crudl',
  },
]);

console.log(extendedRole.canCreate('user')); // true
console.log(extendedRole.canUpdate('user')); // false
console.log(extendedRole.canCreate('post')); // true
console.log(extendedRole.canUpdate('post')); // true
console.log(extendedRole.canDelete('post')); // true
console.log(extendedRole.canList('post')); // true
```

As you can see, the extendedRole instance includes all the permissions of both the original role and the extended role.

In addition to extending a role, you can also add individual permissions using the addPermissions() method. The addPermissions() method takes an array of permissions as an argument and adds them to the existing permissions of the role instance.

Here's an example of how to add permissions to a role:

```javascript
const extendedRole = role.extend(role);

extendedRole.addPermissions([
  {
    resource: 'post',
    scopes: 'crudl',
  },
]);

console.log(extendedRole.canCreate('user')); // true
console.log(extendedRole.canUpdate('user')); // false
console.log(extendedRole.canCreate('post')); // true
console.log(extendedRole.canUpdate('post')); // true
console.log(extendedRole.canDelete('post')); // true
console.log(extendedRole.canList('post')); // true
```

Using the extend() and addPermissions() methods, you can easily create complex roles with specific permissions for your application.
