# Authorization

You can use the `ExpressRoleManager` to authorize a request in your express application by creating a new instance and using the `check` method.

Example:

<pre class="language-ts"><code class="lang-ts">import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';

<strong>const role = new Role({
</strong>  name: 'role',
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
</code></pre>
