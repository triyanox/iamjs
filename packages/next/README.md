# `@iamjs/next`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

This package contains the next middleware for iamjs a library for easy role and permissions management for your next application.

## Installation

```bash
npm install @iamjs/core @iamjs/next
# or
yarn add @iamjs/core @iamjs/next
# or
pnpm add @iamjs/core @iamjs/next
# or
bun add @iamjs/core @iamjs/next
```

## Usage

### Authorization

You can use the `NextRoleManager` to authorize a request in your express application by creating a new instance and using the `check` method.

Example:

```ts
import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl',
      custom: {
        'create a new user': false
      }
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new NextRoleManager({
  schema: schema,
  onSuccess: (req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});


const handler = roleManager.check(
    (_req, res) => {
      res.status(200).send('Hello World!');
    },
    {
      resources: 'resource2',
      actions: ['create', 'update'],
      role: 'role',
      strict: true
});

export default handler
```
### Advanced Usage

By using the `construct` option you can use the data from the request to build the role from its own permissions.

Example:

```ts
import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl',
      custom: {
        'create a new user': false
      }
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new NextRoleManager({
  schema: schema,
  onSuccess: (req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});

const withAuth = (handler) => {
  return (req, res) => {
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.check(
    (_req, res) => {
      res.status(200).send('Hello World!');
    },
    {
      resources: 'resource2',
      actions: ['create', 'update'],
      strict: true,
      construct: true, // to use the data from the request to build the role's permissions
      data: async (req)=>{
        return req.permissions
      }
});

export default withAuth(handler);
```

### App Router Api Routes

The `next.js 13` new api routes are using the browser's fetch api so you can't use the middleware with pages
request and response interfaces but you can use the `checkFn` function to check if the user is authenticated
inside the actual route handler.

```ts
import { getUserPermissions } from '@lib/utils/auth';
import { roleManager } from '@lib/utils/api';

export async function GET(request: Request) {
  const authorized = await roleManager.checkFn({
    resources: 'resource2',
    actions: ['read'],
    strict: true,
    construct: true,
    data: async () => {
      return await getUserPermissions(request); // handle getting user permissions
    }
  });

  if (!authorized) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response('Authorized', { status: 200 });
}
```
### Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `NextRoleManager` constructor to handle the success and error cases.

Example:

```ts
import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl',
      custom: {
        'create a new user': false
      }
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new NextRoleManager({
  schema: schema,
  onSuccess: (req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});

const withAuth = (handler) => {
  return (req, res) => {
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.check(
    (_req, res) => {
      res.status(200).send('Hello World!');
    },
    {
      resources: 'resource2',
      actions: ['create', 'update'],
      strict: true,
      construct: true, // to use the data from the request to build the role's permissions
      data: async (req)=>{
        return req.permissions
      }
});

export default withAuth(handler);
```
### Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `check` method accepts a generic type which can be used to define the type of the request or response object.

Example:

```ts
interface Request extends NextApiRequest {
  role: string;
  permissions: Record<string, Record<permission, boolean>>;
}

interface Response extends NextApiResponse {}

import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import next from 'next';

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl',
      custom: {
        'create a new user': false
      }
    }
  }
});

const schema = new Schema({
  roles : { role }
});

const roleManager = new NextRoleManager({
  schema: schema,
  onSuccess: <Request,Response>(req, res) => {
    res.status(200).send('Hello World!');
  },
  onError: <Request,Response>(err, req, res) => {
    console.error(err);
    res.status(403).send('Forbidden');
  }
});

const withAuth = (handler) => {
  return (req, res) => {
    req.permissions = role.toObject();
    return handler(req, res);   
  };
};

const handler = roleManager.check<Request,Response>(
    (_req, res) => {
      res.status(200).send('Hello World!');
    },
    {
      resources: 'resource2',
      actions: ['create', 'update'],
      strict: true,
      construct: true, // to use the data from the request to build the role's permissions
      data: async (req)=>{
        return req.permissions
      }
});

export default withAuth(handler);
```
### Save users activity

You can save user activity using the `onActivity` method on the **NextRoleManager**

```typescript
import { Role, Schema } from "@iamjs/core";
import { NextRoleManager } from "@iamjs/next";
import next from "next";

const role = new Role({
  name: "role",
  config: {
    resource1: {
      base: "crudl",
    },
    resource2: {
      base: "cr-dl",
      custom: {
        "create a new user": false,
      },
    },
  },
});

const schema = new Schema({
  roles: { role },
});

const roleManager = new NextRoleManager({
  schema: schema,
  onSuccess: (req, res) => {
    res.status(200).send("Hello World!");
  },
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).send("Forbidden");
  },
  async onActivity(data) {
    console.log(data); // the activity object
  },
});

const withAuth = (handler) => {
  return (req, res) => {
    req.permissions = role.toObject();
    return handler(req, res);
  };
};

const handler = roleManager.check(
  (_req, res) => {
    res.status(200).send("Hello World!");
  },
  {
    resources: "resource2",
    actions: ["create", "update"],
    strict: true,
    construct: true, // to use the data from the request to build the role's permissions
    data: async (req) => {
      return req.permissions;
    },
  }
);

export default withAuth(handler);
```

The data object contains:

| Name       | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| actions?   | The action or actions that are authorized to be executed on the resource |
| resources? | The resource or resources that are authorized to be accessed             |
| role?      | The role that is used to authorize the request                           |
| success?   | The status of the request                                                |
| req?       | The request object                                                       |
