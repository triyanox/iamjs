# Save users activity

You can save user activity using the `onActivity` method on the **ExpressRoleManager**

```typescript
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
  },
  async onActivity(data){
    console.log(data)
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

The data object contains:

<table><thead><tr><th width="230.5">Name</th><th>Description</th></tr></thead><tbody><tr><td>actions?</td><td>The action or actions that are authorized to be executed on the resource</td></tr><tr><td>resources?</td><td>The resource or resources that are authorized to be accessed</td></tr><tr><td>role?</td><td>The role that is used to authorize the request</td></tr><tr><td>success?</td><td>The status of the request</td></tr><tr><td>req?</td><td>The request object</td></tr></tbody></table>

&#x20;
