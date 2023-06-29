import { AuthManager, Role, Schema } from '@iamjs/core';

describe('Create role and check permissions', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  it('should create a role and check permissions', () => {
    expect(role.can('user', 'ban')).toBe(false);
    expect(role.cannot('user', 'ban')).toBe(true);
    expect(role.can('post', 'publish')).toBe(true);
    expect(role.can('post', 'create')).toBe(false);
    expect(role.canAny('post', ['create', 'read'])).toBe(true);
    expect(role.canAll('post', ['create', 'read'])).toBe(false);
  });
});

describe('Create role and add extra permissions', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const updated = role.add({
    resource: 'page',
    permissions: {
      scopes: 'crudl',
      custom: {
        suspend: false
      }
    }
  });

  expect(updated.can('page', 'create')).toBe(true);
  expect(updated.can('page', 'suspend')).toBe(false);
});

describe('Create role and update existing permissions', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const updated = role.update({
    resource: 'post',
    permissions: {
      scopes: 'crudl',
      custom: {
        suspend: false
      }
    }
  });

  expect(updated.can('post', 'create')).toBe(true);
  expect(updated.can('post', 'suspend')).toBe(false);
});

describe('Create role and remove existing permissions', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const updated = role.remove({
    resource: 'post'
  });

  expect(updated.getResources().length).toBe(1);
});

describe('Convert the role to object and back to role', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const object = role.toObject();

  expect(role.getResources().length).toEqual(object.resources.length);
  expect(role.config).toEqual(object.config);

  const fromObject = Role.fromObject(object);
  expect(fromObject.can('post', 'read')).toBe(true);
});

describe('Convert the role to string and back to role', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        scopes: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        scopes: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const string = role.toJSON();

  const fromObject = Role.fromJSON<typeof role>(string);
  expect(fromObject.can('post', 'read')).toBe(true);
});

describe('Create an auth manager and manage authorization', () => {
  const roles = {
    user: new Role({
      name: 'user',
      config: {
        user: {
          scopes: '-r--l',
          custom: {
            ban: false
          }
        },
        post: {
          scopes: 'crudl',
          custom: {
            publish: true
          }
        }
      }
    }),
    admin: new Role({
      name: 'user',
      config: {
        user: {
          scopes: 'crudl',
          custom: {
            ban: true
          }
        },
        post: {
          scopes: 'crudl',
          custom: {
            publish: true
          }
        }
      }
    })
  };

  const schema = new Schema(roles);
  const auth = new AuthManager(schema);

  const isAdminAuthorized = auth.authorize({
    role: 'admin',
    actions: ['ban', 'create'],
    resources: 'user'
  });

  const isUserAuthorized = auth.authorize({
    role: 'user',
    actions: ['read', 'create'],
    resources: ['post', 'user'],
    strict: true
  });

  expect(isAdminAuthorized).toBe(true);
  expect(isUserAuthorized).toBe(false);
});
