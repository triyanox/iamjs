import { AuthManager, Role, Schema } from '@iamjs/core';
import crypto from 'crypto';

describe('Create role and check permissions', () => {
  const role = new Role({
    name: 'role',
    config: {
      user: {
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
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
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const updated = role.add({
    resource: 'page',
    permissions: {
      base: 'crudl',
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
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const updated = role.update({
    resource: 'post',
    permissions: {
      base: 'crudl',
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
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
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
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
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
        base: 'crudl',
        custom: {
          ban: false
        }
      },
      post: {
        base: '-rudl',
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
          base: '-r--l',
          custom: {
            ban: false
          }
        },
        post: {
          base: 'crudl',
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
          base: 'crudl',
          custom: {
            ban: true
          }
        },
        post: {
          base: 'crudl',
          custom: {
            publish: true
          }
        },
        page: {
          base: 'crudl'
        }
      }
    })
  };

  const schema = new Schema({
    roles
  });

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

describe('create a role encrypt it and decrypt it', () => {
  const role = new Role({
    name: 'user',
    config: {
      user: {
        base: '-r--l',
        custom: {
          ban: false
        }
      },
      post: {
        base: 'crudl',
        custom: {
          publish: true
        }
      }
    }
  });

  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const algorithm = 'aes-256-cbc';

  const encrypt = (data: string) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  };

  const decrypt = (data: { iv: string; encryptedData: string }) => {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  };

  const encrypted = role.toJSON((data) => encrypt(data).encryptedData);
  const decryptedRole = Role.from(encrypted, (data) => {
    const decrypted = decrypt({ iv: encrypt(data).iv, encryptedData: data });
    return Role.fromJSON(decrypted).toObject();
  });

  expect(decryptedRole.can('user', 'read')).toBe(true);
});
