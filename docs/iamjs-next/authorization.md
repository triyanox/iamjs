# Authorization

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
