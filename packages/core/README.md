# `@iamjs/core`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

## Overview

iamjs is a powerful and flexible library for implementing role-based access control (RBAC) in JavaScript applications. The core package (`@iamjs/core`) provides essential functionality for managing roles, permissions, and authorization in your application. With iamjs, you can easily define complex permission structures, manage user roles, and enforce access control throughout your application.

## Table of Contents

- [Installation](#installation)
- [Key Concepts](#key-concepts)
- [Usage](#usage)
  - [Creating Roles](#creating-roles)
  - [Managing Permissions](#managing-permissions)
  - [Checking Permissions](#checking-permissions)
  - [Authorization Management](#authorization-management)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
  - [Serialization and Deserialization](#serialization-and-deserialization)
  - [Custom Data Transformations](#custom-data-transformations)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the iamjs core library using your preferred package manager:

```bash
npm install @iamjs/core
# or
yarn add @iamjs/core
# or
pnpm add @iamjs/core
# or
bun add @iamjs/core
```

## Key Concepts

- **Role**: A set of permissions that can be assigned to users. Roles define what actions a user can perform on various resources.
- **Resource**: An entity in your application that actions can be performed on (e.g., 'user', 'post', 'comment').
- **Action**: An operation that can be performed on a resource (e.g., 'create', 'read', 'update', 'delete', 'list').
- **Permission**: A combination of a resource and allowed actions. Permissions can be base permissions (CRUD operations) or custom permissions specific to your application.
- **Schema**: A collection of roles that defines the overall authorization structure of your application.

## Usage

### Creating Roles

Create new roles using the `Role` class. You can define base permissions using CRUD notation and add custom permissions as needed.

```typescript
import { Role } from '@iamjs/core';

// Create a basic user role
const userRole = new Role({
  name: 'user',
  description: 'Standard user with limited permissions',
  config: {
    user: {
      base: '-r--l', // Can only read and list users
      custom: { 
        updateOwnProfile: true 
      }
    },
    post: {
      base: 'crud-', // Can create, read, update, but not delete posts
      custom: { 
        publish: true,
        unpublish: true
      }
    },
    comment: {
      base: 'crudl', // Full access to comments
      custom: {
        report: true
      }
    }
  }
});

// Create an admin role with full permissions
const adminRole = new Role({
  name: 'admin',
  description: 'Administrator with full access',
  config: {
    user: {
      base: 'crudl',
      custom: { 
        ban: true,
        unban: true
      }
    },
    post: {
      base: 'crudl',
      custom: { 
        publish: true,
        unpublish: true,
        feature: true
      }
    },
    comment: {
      base: 'crudl',
      custom: {
        delete: true,
        restore: true
      }
    }
  }
});
```

In these examples, we've created two roles: a `user` role with limited permissions and an `admin` role with full access. The base permissions use CRUD notation (Create, Read, Update, Delete, List), where a dash (-) indicates the absence of that permission.

### Managing Permissions

You can extend or update role permissions using the `add` and `update` methods:

```typescript
// Add a new resource to the user role
const extendedUserRole = userRole.add({
  resource: 'category',
  permissions: {
    base: '-r--l', // Users can only read and list categories
    custom: { 
      subscribe: true,
      unsubscribe: true
    }
  }
});

// Update existing permissions for the admin role
const updatedAdminRole = adminRole.update({
  resource: 'user',
  permissions: {
    base: 'crudl',
    custom: { 
      ban: true,
      unban: true,
      promoteToModerator: true // New custom permission
    }
  }
});

// Remove a resource from a role
const reducedUserRole = userRole.remove({
  resource: 'comment'
});
```

These methods allow you to dynamically adjust permissions as your application evolves.

### Checking Permissions

The `Role` class provides several methods to check permissions:

```typescript
// Check if a role can perform a specific action on a resource
console.log(userRole.can('post', 'create')); // true
console.log(userRole.can('user', 'delete')); // false

// Check if a role cannot perform a specific action
console.log(userRole.cannot('user', 'ban')); // true

// Check if a role can perform any of the specified actions
console.log(userRole.canAny('post', ['create', 'delete'])); // true

// Check if a role can perform all of the specified actions
console.log(userRole.canAll('post', ['create', 'read', 'update', 'delete'])); // false
```

These methods make it easy to implement fine-grained access control in your application logic.

### Authorization Management

Use the `AuthManager` class for centralized authorization management:

```typescript
import { AuthManager, Schema } from '@iamjs/core';

// Create a schema with multiple roles
const schema = new Schema({ 
  roles: { 
    user: userRole, 
    admin: adminRole,
    moderator: moderatorRole // Assuming you've defined this role
  } 
});

// Initialize the AuthManager with the schema
const auth = new AuthManager(schema);

// Check authorization for different scenarios
console.log(auth.authorize({
  role: 'user',
  actions: ['read', 'create'],
  resources: 'post'
})); // true

console.log(auth.authorize({
  role: 'user',
  actions: ['delete'],
  resources: 'post'
})); // false

console.log(auth.authorize({
  role: 'admin',
  actions: ['ban'],
  resources: 'user'
})); // true

// Check multiple resources at once
console.log(auth.authorize({
  role: 'moderator',
  actions: ['update', 'delete'],
  resources: ['post', 'comment'],
  strict: true // Requires permission for all specified resources
})); // Depends on moderator role definition
```

The `AuthManager` provides a convenient way to check permissions across different roles and resources in your application.

## API Reference

### Role Class

- `constructor(options: RoleOptions)`
- `add(options: AddOptions): Role`
- `update(options: UpdateOptions): Role`
- `remove(options: RemoveOptions): Role`
- `can(resource: string, action: string): boolean`
- `cannot(resource: string, action: string): boolean`
- `canAny(resource: string, actions: string[]): boolean`
- `canAll(resource: string, actions: string[]): boolean`
- `toObject(): object`
- `toJSON(): string`
- `static fromObject(obj: object): Role`
- `static fromJSON(json: string): Role`
- `static from(data: any, transform: Function): Role`

### AuthManager Class

- `constructor(schema: Schema)`
- `authorize(request: AuthorizationRequest): boolean`

### Schema Class

- `constructor(options: SchemaOptions)`
- `getRole(name: string): Role | undefined`
- `hasRole(name: string): boolean`
- `addRole(role: Role): void`
- `removeRole(name: string): void`

## Advanced Usage

### Serialization and Deserialization

Convert roles to and from different formats for storage or transmission:

```typescript
// Convert a role to JSON
const jsonString = userRole.toJSON();
console.log(jsonString);
// {"name":"user","description":"Standard user with limited permissions","config":{"user":{"base":"-r--l","custom":{"updateOwnProfile":true}},...}}

// Create a role from JSON
const recreatedUserRole = Role.fromJSON(jsonString);

// Convert a role to a plain object
const objectRepresentation = adminRole.toObject();
console.log(objectRepresentation);
// {name: "admin", description: "Administrator with full access", config: {...}}

// Create a role from an object
const recreatedAdminRole = Role.fromObject(objectRepresentation);
```

### Custom Data Transformations

Use the `from` method for creating roles from custom data sources, such as encrypted data:

```typescript
import crypto from 'crypto';
import { Role, GetRoleConfig } from '@iamjs/core';

// Assume we have these encryption functions defined
const encrypt = (data: string) => { /* ... */ };
const decrypt = (data: string) => { /* ... */ };

// Encrypt role data for storage
const encryptedRoleData = encrypt(userRole.toJSON());

// Later, recreate the role from encrypted data
const decryptedRole = Role.from(encryptedRoleData, (data) => {
  const decrypted = decrypt(data);
  return Role.fromJSON(decrypted).toObject() as GetRoleConfig<typeof userRole>;
});

console.log(decryptedRole.can('post', 'create')); // true
```

This approach allows you to securely store and transmit role data while maintaining the ability to recreate functional `Role` instances.

## Best Practices

1. **Granular Permissions**: Define permissions at a granular level to allow for fine-tuned access control.
2. **Hierarchical Roles**: Consider implementing role hierarchies (e.g., admin > moderator > user) to simplify permission management.
3. **Regular Audits**: Periodically review and audit your role definitions to ensure they align with your application's security requirements.
4. **Dynamic Role Assignment**: Implement systems to dynamically assign and revoke roles based on user actions or system events.
5. **Principle of Least Privilege**: Always start with the minimum necessary permissions and add more as needed.
6. **Consistent Naming**: Use consistent naming conventions for resources and actions across your application.
7. **Documentation**: Keep your role definitions and permission structures well-documented for easier maintenance and onboarding.

## Contributing

We welcome contributions to iamjs! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and write tests if applicable
4. Submit a pull request with a clear description of your changes

Please see our [Contributing Guide](CONTRIBUTING.md) for more detailed information.

## License

iamjs is released under the [MIT License](LICENSE). See the LICENSE file for more details.