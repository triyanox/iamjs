# `@iamjs/react`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

## Overview

The @iamjs/react package provides React hooks and components for integrating the iamjs role-based access control (RBAC) library into React applications. This package simplifies the process of managing permissions and authorizing user actions in your React components.

## Table of Contents

- [Installation](#installation)
- [Key Features](#key-features)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Dynamic Role Building](#dynamic-role-building)
  - [Conditional Rendering with Show Component](#conditional-rendering-with-show-component)
- [API Reference](#api-reference)
  - [createSchema](#createschema)
  - [useAuthorization](#useauthorization)
  - [Show Component](#show-component)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use @iamjs/react, you need to install both the core library and the React package:

```bash
npm install @iamjs/core @iamjs/react
# or
yarn add @iamjs/core @iamjs/react
# or
pnpm add @iamjs/core @iamjs/react
# or
bun add @iamjs/core @iamjs/react
```

## Key Features

- React hooks for easy integration of RBAC in React applications
- Schema creation for defining roles and permissions
- Dynamic role building based on user permissions
- Conditional rendering component based on user permissions
- TypeScript support for improved type safety

## Usage

### Basic Usage

Here's a basic example of how to use the @iamjs/react package for authorization in a React component:

```jsx
import React from 'react';
import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';

// Create a schema with roles and permissions
const schema = createSchema({
  user: new Role({
    name: 'user',
    description: 'Standard user role',
    config: {
      books: {
        base: 'crudl',
        custom: {
          publish: true,
          unpublish: false
        }
      }
    }
  })
});

function BookManager() {
  const { can } = useAuthorization(schema);

  const canCreateBook = can('user', 'books', 'create');
  const canPublishBook = can('user', 'books', 'publish');

  return (
    <div>
      <h1>Book Manager</h1>
      {canCreateBook && <button>Create New Book</button>}
      {canPublishBook && <button>Publish Book</button>}
    </div>
  );
}

export default BookManager;
```

In this example, we define a schema with a 'user' role and its permissions for the 'books' resource. The `useAuthorization` hook is then used to check permissions within the component.

### Dynamic Role Building

For scenarios where user permissions are fetched from an API, you can dynamically build roles:

```jsx
import React, { useEffect, useState } from 'react';
import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';

// Create initial schema
const schema = createSchema({
  user: new Role({
    name: 'user',
    description: 'Default user role',
    config: {
      books: { base: 'r---' } // Default: can only read books
    }
  })
});

function useUser() {
  const { build } = useAuthorization(schema);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetch('/api/user-permissions')
      .then(response => response.json())
      .then(data => {
        const builtRole = build(data);
        setUserRole(builtRole);
      })
      .catch(error => console.error('Error fetching permissions:', error));
  }, []);

  return userRole;
}

function DynamicBookManager() {
  const userRole = useUser();

  if (!userRole) {
    return <div>Loading...</div>;
  }

  const { can } = userRole;

  return (
    <div>
      <h1>Dynamic Book Manager</h1>
      {can('books', 'create') && <button>Create New Book</button>}
      {can('books', 'publish') && <button>Publish Book</button>}
    </div>
  );
}

export default DynamicBookManager;
```

This approach allows you to fetch user-specific permissions from your backend and dynamically construct the role, providing more flexible and granular access control.

### Conditional Rendering with Show Component

The `Show` component provides a declarative way to conditionally render content based on user permissions:

```jsx
import React from 'react';
import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';

const schema = createSchema({
  editor: new Role({
    name: 'editor',
    description: 'Editor role',
    config: {
      articles: {
        base: 'crudl',
        custom: {
          publish: true,
          feature: true
        }
      }
    }
  })
});

function ArticleManager() {
  const { Show } = useAuthorization(schema);

  return (
    <div>
      <h1>Article Manager</h1>
      <Show role="editor" resources="articles" actions="create">
        <button>Create New Article</button>
      </Show>
      <Show role="editor" resources="articles" actions={['publish', 'feature']}>
        <div>
          <button>Publish Article</button>
          <button>Feature Article</button>
        </div>
      </Show>
    </div>
  );
}

export default ArticleManager;
```

The `Show` component simplifies conditional rendering based on roles and permissions, making your JSX cleaner and more declarative.

## API Reference

### createSchema

`createSchema(roles: Record<string, Role>): Schema`

Creates a schema object from a record of roles.

### useAuthorization

`useAuthorization(schema: Schema): AuthorizationHook`

A React hook that provides authorization utilities based on the given schema.

Returns an object with the following properties:

- `can: (role: string, resource: string, action: string) => boolean`
- `build: (data: object) => BuiltRole`
- `Show: React.ComponentType<ShowProps>`

### Show Component

`<Show role?: string, resources: string | string[], actions: string | string[]>`

A component for conditional rendering based on permissions.

## Best Practices

1. **Centralize Schema Definition**: Define your schema in a central location and import it where needed to maintain consistency across your application.

2. **Use Environmental Variables**: Store role configurations in environment variables to easily switch between different permission sets for development, staging, and production.

3. **Implement Role Hierarchies**: Utilize role inheritance to create a hierarchy, reducing duplication and simplifying management.

4. **Granular Permissions**: Define permissions at a granular level for fine-tuned access control.

5. **Memoize Authorization Checks**: If performing frequent authorization checks, consider memoizing the results to improve performance.

6. **Keep UI and Authorization in Sync**: Ensure that your UI accurately reflects the user's permissions, hiding or disabling elements they don't have access to.

7. **Regular Audits**: Periodically review and update your role definitions and permissions to ensure they align with your application's evolving security requirements.

## Troubleshooting

- **Permissions Not Updating**: Ensure that you're correctly updating the schema or rebuilding roles when user permissions change.
- **TypeScript Errors**: Make sure you're using the correct types for roles and permissions. The package exports types to help with this.
- **Show Component Not Working**: Verify that you're passing the correct role, resources, and actions to the Show component.
- **Performance Issues**: If you notice performance problems, consider memoizing the results of permission checks or optimizing your schema structure.

## Contributing

We welcome contributions to @iamjs/react! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and write tests if applicable
4. Submit a pull request with a clear description of your changes

Please see our [Contributing Guide](CONTRIBUTING.md) for more detailed information.

## License

@iamjs/react is released under the [MIT License](LICENSE). See the LICENSE file for more details.