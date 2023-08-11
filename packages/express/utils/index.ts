import { Role, Schema } from '@iamjs/core';
import { ExpressRoleManager } from '@iamjs/express';
import express from 'express';
import request from 'supertest';

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

app.get(
  '/resource2',
  roleManager.check({
    resources: 'resource2',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.get(
  '/loose',
  roleManager.check({
    resources: 'resource2',
    actions: ['create', 'update'],
    role: 'role'
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.get(
  '/multiple',
  roleManager.check({
    resources: ['resource1', 'resource2'],
    actions: ['create', 'update'],
    strict: true,
    role: 'role'
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

app.get(
  '/from-permissions',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    construct: true,
    data: async () => {
      return role.toObject();
    }
  }),
  (_req, res) => {
    res.send('Hello World!');
  }
);

const server = request(app);

export default server;
export { roleManager };
