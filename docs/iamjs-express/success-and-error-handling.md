# Success and Error Handling

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
