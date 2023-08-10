import { Role, Schema } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import { createServer } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';

const nextServer = (handler: NextApiHandler) => {
  const server = createServer((req, res) => {
    apiResolver(req, res, undefined, handler, {} as any, false);
  });
  return request(server);
};

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

const roleManager = new NextRoleManager({
  schema,
  onError(_err, _req, res) {
    res.status(403).send('Forbidden');
  }
});

export { nextServer, roleManager };
