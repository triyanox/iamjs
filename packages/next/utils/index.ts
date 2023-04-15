import { Role } from '@iamjs/core';
import { NextRoleManager } from '@iamjs/next';
import { createServer } from 'http';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';

const nextServer = (handler: NextApiHandler) => {
  const server = createServer((req, res) => {
    apiResolver(req, res, undefined, handler, {} as any, false);
  });
  return request(server);
};

const role = new Role([
  {
    resource: 'resource1',
    scopes: 'crudl'
  },
  {
    resource: 'resource2',
    scopes: 'cr-dl'
  }
]);

const roleManager = new NextRoleManager({
  roles: {
    role1: role
  },
  resources: ['resource1', 'resource2'],
  onError(_err, _req, res) {
    res.status(403).send('Forbidden');
  }
});

const authWrapper = <T extends NextApiRequest>(
  handler: (req: T, res: NextApiResponse) => Promise<void> | void
) => {
  return (req: T, res: NextApiResponse) => {
    (req as any).role = 'role1';
    (req as any).permissions = role.toObject();
    handler(req, res);
  };
};

export { authWrapper, nextServer, roleManager };
