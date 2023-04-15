<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# `iamjs/core`

This package contains the core functionality of iamjs a library for easy role and permissions management for your application.

## Installation

```bash
npm install @iamjs/core
```

or

```bash
yarn add @iamjs/core
```

## Usage

### Creating a role

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

### Extending a role

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

### Overriding permissions in an extended role

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

### Save and load roles

You can save a role to a JSON file using the `generate` method.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

role.generate('json'); // json string
role.generate('object'); // javascript object
```

You can load a role from a JSON file using the `fromJSON` or `fromObject` method.

```ts
import { Role } from '@iamjs/core';

const roleFromJSON = Role.fromJSON('json string'); 
const roleFromObject = Role.fromObject('javascript object'); 
```

### Validate a role

You can check if a role is valid using the `validate` method.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

Role.validate(role); // true

// or you can use a callback

role.validate(role, (result, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result); // true
  }
});
```

### Creating an authorization manager

`iamjs/core` exports a `AuthManager` class that can be used to create a role manager.

The `AuthManager` class constructor takes an object with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| `roles` | `{ [key: string]: Role }` | An object containing the roles. |
| `resources` | `[string]` | An array of resources. |

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

### Authorizing a role

The `AuthManager` class exposes `authorizeRole` method that can be used to authorize a role.

The `authorizeRole` method takes an object with the following properties.

| Property | Type | Description |
| --- | --- | --- |
| `role` | `string` | The name of the role. |
| `resource` | `string or [string]` | The name of the resource or an array of resources. |
| `action` | `string or [string]` | The name of the action or an array of actions. |
| `constructRole` | `boolean` | A flag to construct the role if it doesn't exist. |
| `permissions` | `{ [key: string]: string }` | An object containing the permissions to construct the role. |
| `loose` | `boolean` | A flag to allow loose authorization. |

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

## License

[MIT]('../../../../LICENSE)
