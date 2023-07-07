import { nextServer, roleManager } from '../utils';

describe('NextRoleManager', () => {
  it('should return 403 when role is not authorized', async () => {
    const handler = roleManager.check(
      (_req, res) => {
        res.status(200).send('Hello World!');
      },
      {
        resources: 'resource2',
        actions: ['create', 'update'],
        role: 'role',
        strict: true
      }
    );

    const res = await nextServer(handler).get('/resource2');
    expect(res.status).toBe(403);
    expect(res.text).toBe('Forbidden');
  });

  it('should return 200 when role is authorized', async () => {
    const handler = roleManager.check(
      (_req, res) => {
        res.status(200).send('Hello World!');
      },
      {
        resources: 'resource1',
        actions: ['create', 'update'],
        role: 'role'
      }
    );

    const res = await nextServer(handler).get('/resource1');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  it('should return 200 when role is authorized', async () => {
    const handler = roleManager.check(
      (_req, res) => {
        res.status(200).send('Hello World!');
      },
      {
        resources: 'resource1',
        actions: ['create', 'update'],
        role: 'role'
      }
    );

    const res = await nextServer(handler).get('/resource1');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });
});
