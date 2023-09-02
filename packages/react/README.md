# `@iamjs/react`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

This package contains the react hook for iamjs a library for easy role and permissions management for your application.

## Installation

```bash
npm install @iamjs/core @iamjs/react
# or
yarn add @iamjs/core @iamjs/react
# or
pnpm add @iamjs/core @iamjs/react
# or
bun add @iamjs/core @iamjs/react
```

## Usage

### Basic usage

This example demonstrates the usage of the `@iamjs/core` and `@iamjs/react` packages for role-based authorization.

1. Import the necessary components and functions from the packages:

```javascript
import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';
```

2. Create a schema using the `createSchema` function:

```javascript
const schema = createSchema({
  user: new Role({
    name: 'user',
    description: 'User role',
    meta: {
      name: 'user'
    },
    config: {
      books: {
        base: 'crudl',
        custom: {
          upgrade: true,
          downgrade: false,
          sort: true
        }
      }
    }
  })
});
```

In this example, the schema is created with a single role named 'user'. The role has a description, meta data, and configuration for the 'books' resource. The 'books' resource has 'crudl' scopes (create, read, update, delete, list), and additional custom permissions such as 'upgrade', 'downgrade', and 'sort'.

3. Use the `useAuthorization` hook to access the authorization methods:

```javascript
const { can } = useAuthorization(schema);
```

The `useAuthorization` hook takes the schema as a parameter and returns an object that includes the `can` method to check permissions.

4. Use the `can` method to check if the user has permission:

```javascript
const canDo = can('user', 'books', 'create').toString(); // 'true'
```

The `can` method is called with the role name ('user'), the resource name ('books'), and the action ('create'). It returns a boolean value indicating whether the user with the 'user' role has permission to create books.

In summary, this example demonstrates how to create a schema with a role and its permissions using the `@iamjs/core` package. Then, the `@iamjs/react` package is used to access the `useAuthorization` hook and check permissions using the `can` method.&#x20;

### Build a role from its permissions

This example also demonstrates the usage of the build function for permissions based authorization.

```typescript
import { Role } from "@iamjs/core";
import { createSchema, useAuthorization } from "@iamjs/react";
import { useEffect, useState } from "react";

// Create the initial schema with a default roles
const schema = createSchema({
  user: new Role({
    name: "user",
    description: "User role",
    meta: {
      name: "user",
    },
    config: {
      books: {
        base: "crudl",
        custom: {
          upgrade: true,
          downgrade: false,
          sort: true,
        },
      },
    },
  }),
});

// Custom hook to fetch user permissions and build the role
const useUser = () => {
  const { build } = useAuthorization(schema);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Call the API endpoint to fetch user permissions
    fetch("/permssions")
      .then((response) => response.json())
      .then((data) => {
        // Build the role based on the received permissions
        const builtRole = build(data);
        setUserRole(builtRole);
      })
      .catch((error) => {
        console.error("Error fetching user permissions:", error);
      });
  }, []);

  return userRole;
};

const Component = () => {
  const userRole = useUser();

  if (!userRole) {
    return <div>Loading...</div>;
  }

  const { can, Show } = userRole;

  return (
    <div>
      <div>{can("books", "create").toString()}</div>
      <Show resources="books" actions="create">
        <div>Rendered if user has 'create' permission for 'books'</div>
      </Show>
    </div>
  );
};
```
### Show component based on permission

This example also demonstrates the usage of the Show component for conditional rendering based on the user's permssions.

1. Import the necessary components and functions from the packages:

```javascript
import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';
```

2. Create a schema using the `createSchema` function:

```javascript
const schema = createSchema({
  user: new Role({
    name: 'user',
    description: 'User role',
    meta: {
      name: 'user'
    },
    config: {
      books: {
        base: 'crudl',
        custom: {
          upgrade: true,
          downgrade: false,
          sort: true
        }
      }
    }
  })
});
```

The schema is created in the same way as in the previous example, with a role named 'user' and its permissions for the 'books' resource.

3. Use the `useAuthorization` hook to access the authorization components:

```javascript
const { Show } = useAuthorization(schema);
```

The `useAuthorization` hook is used to access the authorization components. In this example, only the `Show` component is extracted from the returned object.

4. Render the `Show` component with the appropriate props:

```javascript
<Show role="user" resources="books" actions="create">
  <div>can show</div>
</Show>
```

The `Show` component is used to conditionally render the child components based on the user's role and permissions. It takes props specifying the role, resources, and actions, and renders the child components if the user has permission.&#x20;

In summary, this example demonstrates how to use the `Show` component from the `@iamjs/react` package to conditionally render components based on the user's role and permissions. The component is rendered within the `Show` component's block if the user has the specified role, resources, and actions.
