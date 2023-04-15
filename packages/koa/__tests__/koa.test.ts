import server from '../utils';

describe('GET /resource1', () => {
  it('should return 200 OK', () => {
    return server.get('/resource1').expect(200);
  });
});

describe('GET /resource2', () => {
  it('should return 403 Forbidden', () => {
    return server.get('/resource2').expect(403);
  });
});

describe('GET /from-permissions', () => {
  it('should return 200 OK', () => {
    return server.get('/from-permissions').expect(200);
  });
});
