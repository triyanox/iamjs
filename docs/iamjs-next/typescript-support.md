# Typescript Support

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
