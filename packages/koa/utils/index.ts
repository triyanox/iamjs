import { Role, Schema } from '@iamjs/core';
import { KoaRoleManager } from '@iamjs/koa';
import Koa from 'koa';
import Router from 'koa-router';
import request from 'supertest';

const app = new Koa();
const router = new Router();

const role = new Role({
  name: 'role',
  config: {
    resource1: {
      base: 'crudl'
    },
    resource2: {
      base: 'cr-dl'
    }
  }
});

const schema = new Schema({
  roles: { role }
});

const roleManager = new KoaRoleManager({
  schema,
  async onError(_err, ctx, next) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    await next();
  },
  async onSuccess(ctx, next) {
    ctx.status = 200;
    ctx.body = 'Hello World from the success handler!';
    await next();
  }
});

router.get(
  '/resource1',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

router.get(
  '/resource2',
  roleManager.check({
    resources: 'resource2',
    actions: ['create', 'update'],
    role: 'role',
    strict: true
  }),
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

router.get(
  '/loose',
  roleManager.check({
    resources: 'resource2',
    actions: ['create', 'update'],
    role: 'role'
  }),
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

router.get(
  '/multiple',
  roleManager.check({
    resources: ['resource1', 'resource2'],
    actions: ['create', 'update'],
    strict: true,
    role: 'role'
  }),
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

router.get(
  '/from-permissions',
  roleManager.check({
    resources: 'resource1',
    actions: ['create', 'update'],
    construct: true,
    data: async () => {
      return role.toObject();
    }
  }),
  (ctx) => {
    ctx.body = 'Hello World!';
  }
);

app.use(router.routes());
const server = request.agent(app.callback());

export default server;
export { roleManager };
