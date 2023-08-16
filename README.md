<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# **iamjs** - Your complete Access Control Library

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>

`iamjs` is a fully-featured library that makes authorization easy. It is designed to be used in both Node.js and browser environments, and currently supports popular frameworks like express, koa, next.js, and react.

## Installation

You can install `iamjs` using one of the following packages:
  
- [`@iamjs/express` 🚀](https://iamjs.achaq.dev/express) - for express middleware
- [`@iamjs/koa` 🐱‍🏍](https://iamjs.achaq.dev/koa) - for koa middleware
- [`@iamjs/next` ⏭](https://iamjs.achaq.dev/next) - for next.js middleware
- [`@iamjs/react` ⚛️](https://iamjs.achaq.dev/react) - for react component

Alternatively, you can use the [`@iamjs/core` 🧠](https://iamjs.achaq.dev/core) package, which contains all the necessary logic and can be used with any framework.

## Documentation

> You can check the full documentation [here](https://iamjs.achaq.dev/) learn more about the capabilities of `iamjs` and how to use it in you next project.



## Usage

Let's say you have a simple express app with a single route and you want to add access control to it. First, you need to install the `@iamjs/express` package:

```bash
npm install @iamjs/core @iamjs/express 
``` 
Then, you need to create a role use the `Role` class from `@iamjs/core`:

```ts
import { Role } from '@iamjs/core';

const role = new Role({
  name: "role",
  description: "role description",
  meta: {
    // optional
  },
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
```
This role has a `name` and `description` and `meta` object so you can store any additional information about the role,
then we have a config object which contains the permissions for each resource. The `base` property is used to define the base permissions for the resource, and the `custom` property is used to define custom permissions for the resource the base permissions are `create`, `read`, `update`, `delete`, and `list`. The `custom` permissions are optional and can be used to define more granular permissions for the resource.

Then you need to create a schema for the role using the `Schema` class from `@iamjs/core`:

```ts
import { Schema } from '@iamjs/core';

const schema = new Schema({
 roles : { role }
});
```

The shema takes an object with the roles as the value, and the name of the role as the key. You can add as many roles as you want to the schema.
The schema instance provides a list of useful methods those methods are used by the role manager in that case we are using the express.js role manager form iamjs.

```ts
import { ExpressRoleManager } from "@iamjs/express";

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
```

The role manager takes a schema instance and an `onSuccess` handler called when the request is fullfiled and `onError` when the user is not authorized and `onActivity` is used to save the user's activity. Then you can use a middleware funtion to check if the user is authorized to access the route:

```ts
import express from "express";
 
const app = express();

app.get(
  "/resource1",
  roleManager.check({
    resources: "resource1",
    actions: ["create", "update"],
    role: "role",
    strict: true,
    // or you can construct the role from permissions
    construct: true,
    data: async (req) => {
      return req.permissions;
    },
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);
 
app.listen(3000, () => {
  console.log("Example app listening at http://localhost:3000");
});
``` 
The check method returns a middleware function that can be used to check if the user is authorized to access the route.


## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) for more information.

## License

[MIT](https://github.com/triyanox/iamjs/blob/main/LICENSE)
