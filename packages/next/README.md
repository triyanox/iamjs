# `@iamjs/next`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

## Overview

The @iamjs/next package provides middleware for integrating the iamjs role-based access control (RBAC) library with Next.js applications. This middleware simplifies the process of managing permissions and authorizing requests in both API routes and App Router configurations.

## Table of Contents

- [Installation](#installation)
- [Key Features](#key-features)
- [Usage](#usage)
  - [Basic Authorization](#basic-authorization)
  - [Advanced Usage with Dynamic Role Construction](#advanced-usage-with-dynamic-role-construction)
  - [App Router API Routes](#app-router-api-routes)
  - [Custom Success and Error Handling](#custom-success-and-error-handling)
  - [TypeScript Support](#typescript-support)
  - [Logging User Activity](#logging-user-activity)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use @iamjs/next, you need to install both the core library and the Next.js middleware:

```bash
npm install @iamjs/core @iamjs/next
# or
yarn add @iamjs/core @iamjs/next
# or
pnpm add @iamjs/core @iamjs/next
# or
bun add @iamjs/core @iamjs/next
```

## Key Features

- Seamless integration with Next.js applications
- Support for both API Routes and App Router
- Flexible role-based access control
- Custom success and error handling
- TypeScript support for improved type safety
- Activity logging for auditing and monitoring

## Usage

### Basic Authorization

Here's a basic example of how to use the @iamjs/next middleware for authorization in a Next.js API route:

```typescript
import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import { NextApiRequest, NextApiResponse } from 'next';

// Define a role
const userRole = new Role({
  name: 'user',
  config: {
    posts: {
      base: 'crudl',
      custom: {
        publish: true
      }
    },
    comments: {
      base: 'crud-'
    }
  }
});

// Create a schema with roles
const schema = new Schema({
  roles: { user: userRole }
});

// Initialize the NextRoleManager
const roleManager = new NextRoleManager({
  schema,
  onSuccess: (req, res) => {
    res.status(200).json({ message: 'Access granted' });
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).json({ error: 'Access denied' });
  }
});

// API route handler
const handler = roleManager.check(
  (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: 'Posts retrieved successfully' });
  },
  {
    resources: 'posts',
    actions: ['read', 'list'],
    role: 'user',
    strict: true
  }
);

export default handler;
```

In this example, we define a `user` role with specific permissions for `posts` and `comments` resources. The `NextRoleManager` is then used to check if the user has the required permissions to access the API route.

### Advanced Usage with Dynamic Role Construction

For more complex scenarios, you can dynamically construct roles based on request data:

```typescript
import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import { NextApiRequest, NextApiResponse } from 'next';

// ... (previous role and schema setup)

const roleManager = new NextRoleManager({
  schema,
  onSuccess: (req, res) => {
    res.status(200).json({ message: 'Access granted' });
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).json({ error: 'Access denied' });
  }
});

// Middleware to attach user permissions to the request
const withAuth = (handler) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    // In a real app, you'd fetch this from a database or JWT
    req.permissions = userRole.toObject();
    return handler(req, res);
  };
};

const handler = roleManager.check(
  (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: 'Posts retrieved successfully' });
  },
  {
    resources: 'posts',
    actions: ['read', 'list'],
    strict: true,
    construct: true,
    data: async (req) => req.permissions
  }
);

export default withAuth(handler);
```

This approach allows you to construct the role dynamically based on the user's actual permissions, which could be stored in a database or included in a JWT.

### App Router API Routes

For Next.js 13+ App Router API routes, which use the Web Fetch API, you can use the `checkFn` method:

```typescript
import { NextResponse } from 'next/server';
import { roleManager } from '@/lib/roleManager';
import { getUserPermissions } from '@/lib/auth';

export async function GET(request: Request) {
  const authorized = await roleManager.checkFn({
    resources: 'posts',
    actions: ['read'],
    strict: true,
    construct: true,
    data: async () => {
      return await getUserPermissions(request);
    }
  });

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ message: 'Posts retrieved successfully' }, { status: 200 });
}
```

This method allows you to perform authorization checks within the new App Router API routes.

### Custom Success and Error Handling

You can customize how the middleware handles successful and failed authorization attempts:

```typescript
const roleManager = new NextRoleManager({
  schema,
  onSuccess: (req, res) => {
    console.log('Authorization successful for user:', req.userId);
    res.status(200).json({ message: 'Access granted' });
  },
  onError: (err, req, res) => {
    console.error('Authorization failed:', err);
    res.status(403).json({
      error: 'Access denied',
      details: err.message
    });
  }
});
```

These handlers give you fine-grained control over the response sent to the client and allow for custom logging or other actions.

### TypeScript Support

The @iamjs/next package provides strong TypeScript support. You can use generics to specify the types of your request and response objects:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

interface CustomRequest extends NextApiRequest {
  userId: string;
  permissions: object;
}

interface CustomResponse extends NextApiResponse {}

const roleManager = new NextRoleManager({
  schema,
  onSuccess: <CustomRequest, CustomResponse>((req, res) => {
    console.log('Authorized user:', req.userId);
    res.status(200).json({ message: 'Access granted' });
  }),
  onError: <CustomRequest, CustomResponse>((err, req, res) => {
    console.error(`User ${req.userId} unauthorized:`, err);
    res.status(403).json({ error: 'Access denied' });
  })
});

const handler = roleManager.check<CustomRequest, CustomResponse>(
  (req, res) => {
    res.status(200).json({ message: `Posts retrieved for user ${req.userId}` });
  },
  {
    resources: 'posts',
    actions: ['read', 'list'],
    role: 'user'
  }
);
```

This ensures type safety throughout your application, reducing the likelihood of runtime errors.

### Logging User Activity

The `NextRoleManager` allows you to log user activity, which can be useful for auditing and monitoring:

```typescript
const roleManager = new NextRoleManager({
  schema,
  onSuccess: (req, res) => {
    res.status(200).json({ message: 'Access granted' });
  },
  onError: (err, req, res) => {
    res.status(403).json({ error: 'Access denied' });
  },
  async onActivity(data) {
    console.log('User activity:', data);
    // In a real application, you might want to save this to a database
    await saveActivityLog(data);
  }
});
```

The `onActivity` handler receives an object with the following properties:

| Property   | Description                                               |
|------------|-----------------------------------------------------------|
| actions    | The action(s) that were authorized                        |
| resources  | The resource(s) that were accessed                        |
| role       | The role used for authorization                           |
| success    | Whether the authorization was successful                  |
| req        | The Next.js request object (for additional context)       |

## API Reference

### NextRoleManager

- `constructor(options: NextRoleManagerOptions)`
- `check(handler: NextApiHandler, options: CheckOptions): NextApiHandler`
- `checkFn(options: CheckOptions): Promise<boolean>`

### NextRoleManagerOptions

- `schema: Schema` - The iamjs Schema containing role definitions
- `onError?: (err: Error, req: NextApiRequest, res: NextApiResponse) => void`
- `onSuccess?: (req: NextApiRequest, res: NextApiResponse) => void`
- `onActivity?: (data: ActivityData) => Promise<void> | void`

### CheckOptions

- `resources: string | string[]` - The resource(s) being accessed
- `actions: string[]` - The action(s) being performed
- `role?: string` - The role to check against (if not using `construct`)
- `strict?: boolean` - Whether to require all specified permissions
- `construct?: boolean` - Whether to construct the role dynamically
- `data?: (req: NextApiRequest) => Promise<object> | object` - Function to retrieve role data (if `construct` is true)

## Best Practices

1. **Use Environment-Specific Schemas**: Create different schemas for different environments (development, staging, production) to manage permissions effectively across your deployment pipeline.

2. **Implement Role Hierarchies**: Utilize role inheritance to create a hierarchy, reducing duplication and simplifying management.

3. **Granular Permissions**: Define permissions at a granular level for fine-tuned access control.

4. **Cache Role Data**: For improved performance, consider caching role data, especially if you're constructing roles dynamically.

5. **Audit Logs**: Implement comprehensive logging using the `onActivity` handler to maintain an audit trail of all authorization decisions.

6. **Error Handling**: Provide clear, informative error messages in your `onError` handler to aid in debugging and improve user experience.

7. **Regular Reviews**: Periodically review and update your role definitions and permissions to ensure they align with your application's evolving security requirements.

## Troubleshooting

- **Authorization Always Fails**: Ensure that the role name in `check()` matches the role defined in your schema.
- **TypeScript Errors**: Make sure you're using the correct types for your request and response objects.
- **Performance Issues**: If you're seeing slow response times, consider caching role data or optimizing your `data` function in dynamic role construction.
- **App Router Compatibility**: Remember to use `checkFn` instead of `check` for App Router API routes.

## Contributing

We welcome contributions to @iamjs/next! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and write tests if applicable
4. Submit a pull request with a clear description of your changes

Please see our [Contributing Guide](CONTRIBUTING.md) for more detailed information.

## License

@iamjs/next is released under the [MIT License](LICENSE). See the LICENSE file for more details.