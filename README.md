<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# iamjs - Your Complete Access Control Library with End-to-End Type Safety

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Documentation](#documentation)
- [Quick Start Guide](#quick-start-guide)
  - [Creating a Role](#creating-a-role)
  - [Creating a Schema](#creating-a-schema)
  - [Using with Express.js](#using-with-expressjs)
- [Framework Support](#framework-support)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Overview

iamjs is a fully-featured and type-safe library that simplifies authorization in JavaScript and TypeScript applications. Designed for versatility, it supports both Node.js and browser environments, making it an ideal choice for a wide range of projects, from server-side applications to complex front-end systems.

## Key Features

- **End-to-End Type Safety**: Leverage TypeScript for robust type checking across your entire authorization system.
- **Flexible Role-Based Access Control (RBAC)**: Define granular permissions with ease.
- **Framework Agnostic**: Core functionality that can be used with any JavaScript framework.
- **Dedicated Framework Support**: Pre-built integrations for popular frameworks like Express, Koa, Next.js, and React.
- **Custom Permissions**: Extend beyond basic CRUD operations with custom action definitions.
- **Activity Logging**: Built-in support for logging authorization activities.

## Installation

iamjs offers multiple packages to suit your specific needs:

```bash
# For Express.js applications
npm install @iamjs/core @iamjs/express

# For Koa applications
npm install @iamjs/core @iamjs/koa

# For Next.js applications
npm install @iamjs/core @iamjs/next

# For React applications
npm install @iamjs/core @iamjs/react

# For framework-agnostic use
npm install @iamjs/core
```

## Documentation

For comprehensive documentation, including advanced features and API references, visit our [official documentation site](https://iamjs.achaq.dev/).

## Quick Start Guide

### Creating a Role

Define roles with specific permissions using the `Role` class:

```typescript
import { Role } from '@iamjs/core';

const userRole = new Role({
  name: 'user',
  description: 'Standard user role',
  meta: {
    createdAt: new Date(),
    updatedAt: new Date()
  },
  config: {
    posts: {
      base: 'crudl',
      custom: {
        publish: true,
        feature: false
      }
    },
    comments: {
      base: 'crud-'
    }
  }
});
```

This example creates a 'user' role with permissions for 'posts' and 'comments' resources. The 'base' property uses CRUD notation (create, read, update, delete, list), while 'custom' allows for additional specific actions.

### Creating a Schema

Group roles into a schema for easier management:

```typescript
import { Schema } from '@iamjs/core';

const schema = new Schema({
  roles: { 
    user: userRole,
    admin: adminRole // Assuming you've defined an adminRole
  }
});
```

### Using with Express.js

Integrate iamjs into an Express.js application:

```typescript
import express from 'express';
import { ExpressRoleManager } from '@iamjs/express';

const app = express();

const roleManager = new ExpressRoleManager({
  schema,
  onError: (err, req, res, next) => {
    res.status(403).json({ error: 'Access Denied', details: err.message });
  },
  onSuccess: (req, res, next) => {
    next();
  },
  async onActivity(data) {
    console.log('Authorization activity:', data);
    // Implement your logging logic here
  }
});

// authMiddleware checks if the user has permission to access the specified resources and actions
const authMiddleware = (resources, actions) => {
  const role = 'user'; // Assuming the user is authenticated and has the 'user' role
  return roleManager.check({
    resources,
    actions,
    role,
    strict: true
  });
};


app.get('/posts', 
  authMiddleware('posts', ['read', 'list']),
  (req, res) => {
    res.json({ message: 'Posts retrieved successfully' });
  }
);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

This setup checks if a 'user' role has permission to read and list posts before allowing access to the '/posts' route.

## Framework Support

iamjs provides dedicated packages for popular frameworks:

- **Express.js**: `@iamjs/express`
- **Koa**: `@iamjs/koa`
- **Next.js**: `@iamjs/next`
- **React**: `@iamjs/react`

Each package offers framework-specific features while maintaining consistent core functionality.

## Advanced Usage

### Dynamic Role Construction

For scenarios where roles need to be constructed dynamically (e.g., based on database data):

```typescript
const roleManager = new ExpressRoleManager({
  schema,
  // ... other options
});

app.get('/dynamic-resource',
  roleManager.check({
    resources: 'dynamicResource',
    actions: ['read'],
    construct: true,
    data: async (req) => {
      // Fetch user permissions from database or JWT
      const userPermissions = await getUserPermissions(req.user.id);
      return userPermissions;
    }
  }),
  (req, res) => {
    res.json({ message: 'Access granted to dynamic resource' });
  }
);
```

This approach allows for flexible, user-specific permissions that can be determined at runtime.

## Best Practices

1. **Granular Permissions**: Define permissions at a granular level for fine-tuned access control.
2. **Use Environment Variables**: Store role configurations in environment variables for easy management across different environments.
3. **Regular Audits**: Periodically review and update your role definitions to ensure they align with your application's evolving security requirements.
4. **Implement Logging**: Utilize the `onActivity` handler to maintain an audit trail of authorization decisions.
5. **Type Safety**: Leverage TypeScript to ensure type safety across your authorization logic.

## Contributing

We welcome contributions to iamjs! Please read our [contributing guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

iamjs is released under the [MIT License](https://github.com/triyanox/iamjs/blob/main/LICENSE).