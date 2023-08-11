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

describe('Test checkFn method', () => {
  it('should return true when role is authorized', async () => {
    const authorized = await roleManager.checkFn({
      resources: 'resource1',
      actions: ['create', 'update'],
      role: 'role'
    });

    expect(authorized).toBe(true);
  });

  it('should return false when role is not authorized', async () => {
    const authorized = await roleManager.checkFn({
      resources: 'resource2',
      actions: ['create', 'update'],
      role: 'role',
      strict: true
    });

    expect(authorized).toBe(false);
  });
});
