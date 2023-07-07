# Save users activity

You can save user activity using the `onActivity` method on the **NextRoleManager**

```typescript
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
  },
  async onActivity(data){
    console.log(data) // the activity object 
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

The data object contains:

<table><thead><tr><th width="230.5">Name</th><th>Description</th></tr></thead><tbody><tr><td>actions?</td><td>The action or actions that are authorized to be executed on the resource</td></tr><tr><td>resources?</td><td>The resource or resources that are authorized to be accessed</td></tr><tr><td>role?</td><td>The role that is used to authorize the request</td></tr><tr><td>success?</td><td>The status of the request</td></tr><tr><td>req?</td><td>The request object</td></tr></tbody></table>

&#x20;
