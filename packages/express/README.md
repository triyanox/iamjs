# `@iamjs/express`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

This package contains the express middleware for iamjs a library for easy role and permissions management for your express application.

## Installation

```bash
npm install @iamjs/core @iamjs/express
# or
yarn add @iamjs/core @iamjs/express
# or
pnpm add @iamjs/core @iamjs/express
# or
bun add @iamjs/core @iamjs/express
```

## Usage

### Authorization

You can use the `ExpressRoleManager` to authorize a request in your express application by creating a new instance and using the `check` method.

Example:

```typescript
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

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
  roles: { role }
});

const roleManager = new ExpressRoleManager({
  schema: schema,
  onError(_err, _req, res, _next) {
    res.status(403).send('Forbidden');
  },
  onSucess(_req, res, _next) {
    res.status(200).send('Hello World from the success handler!');
  }
});

const app = express();

app.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);
```
### Advanced Usage

By using the `construct` option you can use the data from the request to build the role from its own permissions.

```ts
import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

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

const roleManager = new ExpressRoleManager({
  schema: schema,
  onError(_err, _req, res, _next) {
    res.status(403).send('Forbidden');
  },
  onSucess(_req, res, _next) {
    res.status(200).send('Hello World from the success handler!');
  }
});

const app = express();

const auth = async (req, res, next) => {
  req.permissions = role.toObject();
  next();
};

app.get(
  '/resource1',
  auth,
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'rupdate'],
    strict: true,
    construct: true,
    // get the role json or object from the request
    data: async (req) => {
      return req.permissions
    }
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);


app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```

### Success and Error Handling

You can pass `onSuccess` and `onError` handlers to the `ExpressRoleManager` constructor to handle the success and error cases.

Example:

```ts
import { Role } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  schema: schema,
  onError(_err, _req, res, _next) {
    res.status(403).send('Forbidden');
  },
  onSucess(_req, res, _next) {
    res.status(200).send('Hello World from the success handler!');
  }
});


app.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```
### Typescript Support

This package is written in typescript and has type definitions for all the exported types also the `check` method accepts a generic type which can be used to define the type of the request or response object.

Example:

```ts
import { Role } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

const app = express();

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

const roleManager = new ExpressRoleManager({
  schema: schema,
  onSuccess : <express.Request, express.Response>(req, res, next) => {
    res.send('Hello World!');
  },
  onError: <express.Request, express.Response>(err, req, res, next) => {
      console.error(err);
      res.status(403).send('Forbidden');
  },
});

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.permissions = user.toObject();
  next();
};

app.get('/post', 
  auth,
  roleManager.check<express.Request, express.Response>({
    resources: 'resource1',
    actions: ['create', 'rupdate'],
    strict: true,
    construct: true,
    // get the role json or object from the request
    data: async (req) => {
      return req.permissions
    }
  }), 
  (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000');
});
```

### Save users activity

You can save user activity using the `onActivity` method on the **ExpressRoleManager**

```typescript
import { Role } from "@iamjs/core";
import { ExpressRoleManager } from "@iamjs/express";
import express from "express";

const app = express();

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

const roleManager = new ExpressRoleManager({
  schema: schema,
  onError(_err, _req, res, _next) {
    res.status(403).send("Forbidden");
  },
  onSucess(_req, res, _next) {
    res.status(200).send("Hello World from the success handler!");
  },
  async onActivity(data) {
    console.log(data);
  },
});

app.get(
  "/resource1",
  roleManager.check({
    resources: "resource1",
    actions: ["create", "update"],
    role: "role",
    strict: true,
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.listen(3000, () => {
  console.log("Example app listening at http://localhost:3000");
});
```

The data object contains:

| Name       | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| actions?   | The action or actions that are authorized to be executed on the resource |
| resources? | The resource or resources that are authorized to be accessed             |
| role?      | The role that is used to authorize the request                           |
| success?   | The status of the request                                                |
| req?       | The request object                                                       |
