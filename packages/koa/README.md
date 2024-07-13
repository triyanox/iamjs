# `@iamjs/koa`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

## Overview

The @iamjs/koa package provides Koa middleware for the iamjs library, enabling seamless integration of role-based access control (RBAC) into your Koa applications. This middleware simplifies the process of managing permissions and authorizing requests based on user roles in a Koa environment.

## Table of Contents

- [Installation](#installation)
- [Key Features](#key-features)
- [Usage](#usage)
  - [Basic Authorization](#basic-authorization)
  - [Advanced Usage with Dynamic Role Construction](#advanced-usage-with-dynamic-role-construction)
  - [Custom Success and Error Handling](#custom-success-and-error-handling)
  - [TypeScript Support](#typescript-support)
  - [Logging User Activity](#logging-user-activity)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use @iamjs/koa, you need to install both the core library and the Koa middleware:

```bash
npm install @iamjs/core @iamjs/koa
# or
yarn add @iamjs/core @iamjs/koa
# or
pnpm add @iamjs/core @iamjs/koa
# or
bun add @iamjs/core @iamjs/koa
```

## Key Features

- Seamless integration with Koa applications
- Flexible role-based access control
- Support for custom success and error handling
- TypeScript support for improved type safety
- Activity logging for auditing and monitoring

## Usage

### Basic Authorization

Here's a basic example of how to use the @iamjs/koa middleware for authorization:

```typescript
import Koa from 'koa';
import Router from 'koa-router';
import { Role, Schema } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';

const app = new Koa();
const router = new Router();

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

// Initialize the KoaRoleManager
const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = { error: 'Access denied' };
    await next();
  },
  async onSuccess(ctx, next) {
    await next();
  }
});

// Use the middleware to protect a route
router.get('/posts',
  roleManager.check({
    resources: 'posts',
    actions: ['read', 'list'],
    role: 'user'
  }),
  async (ctx) => {
    ctx.body = { message: 'Posts retrieved successfully' };
  }
);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

In this example, we define a `user` role with specific permissions for `posts` and `comments` resources. The `KoaRoleManager` is then used to check if the user has the required permissions to access the `/posts` route.

### Advanced Usage with Dynamic Role Construction

For more complex scenarios, you can dynamically construct roles based on request data:

```typescript
import Koa from 'koa';
import Router from 'koa-router';
import { Role, Schema } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';

// ... (previous role and schema setup)

const app = new Koa();
const router = new Router();

// Middleware to attach user permissions to the context
app.use(async (ctx, next) => {
  // In a real app, you'd fetch this from a database or JWT
  ctx.state.userPermissions = userRole.toObject();
  await next();
});

// Initialize the KoaRoleManager
const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = { error: 'Access denied' };
    await next();
  }
});

router.get('/posts',
  roleManager.check({
    resources: 'posts',
    actions: ['read', 'list'],
    strict: true,
    construct: true,
    data: async (ctx) => ctx.state.userPermissions
  }),
  async (ctx) => {
    ctx.body = { message: 'Posts retrieved successfully' };
  }
);

app.use(router.routes()).use(router.allowedMethods());
```

This approach allows you to construct the role dynamically based on the user's actual permissions, which could be stored in a database or included in a JWT.

### Custom Success and Error Handling

You can customize how the middleware handles successful and failed authorization attempts:

```typescript
const roleManager = new KoaRoleManager({
  schema,
  async onError(err, ctx, next) {
    console.error('Authorization failed:', err);
    ctx.status = 403;
    ctx.body = {
      error: 'Access denied',
      details: err.message
    };
    await next();
  },
  async onSuccess(ctx, next) {
    console.log('Authorization successful for user:', ctx.state.userId);
    await next();
  }
});
```

These handlers give you fine-grained control over the response sent to the client and allow for custom logging or other actions.

### TypeScript Support

The @iamjs/koa package provides strong TypeScript support. You can use generics to specify the types of your context object:

```typescript
import Koa, { Context } from 'koa';
import Router from 'koa-router';

interface CustomContext extends Context {
  state: {
    userId: string;
    userPermissions: object;
  };
}

const roleManager = new KoaRoleManager({
  schema,
  async onSuccess<CustomContext>(ctx, next) {
    console.log('Authorized user:', ctx.state.userId);
    await next();
  },
  async onError<CustomContext>(err, ctx, next) {
    console.error(`User ${ctx.state.userId} unauthorized:`, err);
    ctx.status = 403;
    ctx.body = { error: 'Access denied' };
    await next();
  }
});

router.get('/posts',
  roleManager.check<CustomContext>({
    resources: 'posts',
    actions: ['read'],
    role: 'user'
  }),
  async (ctx: CustomContext) => {
    ctx.body = { message: `Posts retrieved for user ${ctx.state.userId}` };
  }
);
```

This ensures type safety throughout your application, reducing the likelihood of runtime errors.

### Logging User Activity

The `KoaRoleManager` allows you to log user activity, which can be useful for auditing and monitoring:

```typescript
const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = { error: 'Access denied' };
    await next();
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
| ctx        | The Koa context object (for additional context)           |

## API Reference

### KoaRoleManager

- `constructor(options: KoaRoleManagerOptions)`
- `check(options: CheckOptions): Koa.Middleware`

### KoaRoleManagerOptions

- `schema: Schema` - The iamjs Schema containing role definitions
- `onError?: (err: Error, ctx: Koa.Context, next: Koa.Next) => Promise<void>`
- `onSuccess?: (ctx: Koa.Context, next: Koa.Next) => Promise<void>`
- `onActivity?: (data: ActivityData) => Promise<void> | void`

### CheckOptions

- `resources: string | string[]` - The resource(s) being accessed
- `actions: string[]` - The action(s) being performed
- `role?: string` - The role to check against (if not using `construct`)
- `strict?: boolean` - Whether to require all specified permissions
- `construct?: boolean` - Whether to construct the role dynamically
- `data?: (ctx: Koa.Context) => Promise<object> | object` - Function to retrieve role data (if `construct` is true)

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
- **TypeScript Errors**: Make sure you're using the correct types for your context object.
- **Performance Issues**: If you're seeing slow response times, consider caching role data or optimizing your `data` function in dynamic role construction.

## Contributing

We welcome contributions to @iamjs/koa! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and write tests if applicable
4. Submit a pull request with a clear description of your changes

Please see our [Contributing Guide](CONTRIBUTING.md) for more detailed information.

## License

@iamjs/koa is released under the [MIT License](LICENSE). See the LICENSE file for more details.