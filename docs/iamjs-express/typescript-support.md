# Typescript Support

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
      scopes: 'crudl'
    },
    resource2: {
      scopes: 'cr-dl',
      custom: {
        'create a new user': false
      }
    }
  }
});

const schema = new Schema({
  role
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
