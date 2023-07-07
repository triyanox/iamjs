# Advanced Usage

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
