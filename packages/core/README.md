# `@iamjs/core`

<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/banner.png" alt="iamjs banner"
title="iamjs" align="center" height="auto" width="100%"/>
This package contains the core functionality of iamjs a library for easy role and permissions management for your application.

## Installation

```bash
npm install @iamjs/core
# or
yarn add @iamjs/core
# or
pnpm add @iamjs/core
# or
bun add @iamjs/core
```

## Usage

### Create a new Role instance

You can create a new role instance by using the `Role` class.

```ts
import { Role } from '@iamjs/core';

const role = new Role({
    name: 'role',
    description: 'role description',
    meta: {
      key: 'value'
    },
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
```

This code creates a new instance of the `Role` class. The `Role` constructor takes an object as its parameter, which defines the properties of the role.

* `name` (string): Specifies the name of the role.
* `description` (string): Provides a description of the role.
* `meta` (object): An optional object that can hold additional metadata for the role.
* `config` (object): Contains configuration options for the role. It consists of resource permissions, where each resource is defined as a key in the `config` object.

In this example:

* There are two resources defined: `user` and `post`.
* The `user` resource has default permissions set to `'crudl'`, which typically stands for create, read, update, delete, and list.
* The `user` resource also has a custom permission `ban` set to `false`.
* The `post` resource has default permissions set to `'-rudl'`. The prefixing dash (`-`) before `rudl` signifies that the `read` permission is set to `false`.
* The `post` resource has a custom permission `publish` set to `true`.

The resulting `role` object represents a role with the specified name, description, metadata, and resource permissions.

### Extending a Role instance

You can extend a role instance by using the `add` method.

```ts
const extended = role.add({
    resource: 'page',
    permissions: {
      base: 'crudl',
      custom: {
        suspend: false
      }
    }
}) // returns a new role instance

extended.can('page', 'create') // true
extended.can('page', 'suspend') // false
```

The `add` method allows you to extend a role instance by adding permissions for a new resource. It takes an `addOptions` object as its parameter, which includes the following properties:

* `resource` (string): The name of the resource for which you want to add permissions.
* `permissions` (object): The permissions to add for the specified resource.
  * `base` (string): The base permissions to add for the resource. This can be a combination of create, read, update, delete, and list permissions.
  * `custom` (object): The custom permissions to add for the resource. These can be any additional permissions specific to the resource.

Additionally, there are two optional properties that you can include in the `updateOptions` object:

* `mutate` (boolean, default: `false`): If set to `true`, the `update` method will mutate the existing role instance instead of returning a new instance with the updated permissions.
* `noOverride` (boolean, default: `false`): If set to `true`, the `update` method will not override existing permissions for the specified resource. Instead, it will merge the new permissions with the existing ones.

### Update a resource

You can update a resource's permission in a role instance by using the `update` method.

```ts
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
}); // returns a new role instance

updated.can('post', 'create') // true
updated.can('post', 'suspend') // false  
```

The `update` method allows you to modify the permissions of a role instance for a specific resource. It takes an `updateOptions` object as its parameter, which contains the following properties:

* `resource` (string): The name of the resource for which you want to update the permissions.
* `permissions` (object): The updated permissions for the specified resource.
  * `base` (string): The new base permisisons for the resource. This can be a combination of create, read, update, delete, and list permissions. Use `-` before a scope to exclude it (e.g., `'-rudl'`).
  * `custom` (object): The updated custom permissions for the resource. These can be any additional permissions specific to the resource.

Additionally, there are two optional properties that you can include in the `updateOptions` object:

* `mutate` (boolean, default: `false`): If set to `true`, the `update` method will mutate the existing role instance instead of returning a new instance with the updated permissions.
* `noOverride` (boolean, default: `false`): If set to `true`, the `update` method will not override existing permissions for the specified resource. Instead, it will merge the new permissions with the existing ones.

### Remove a resource

You can remove a resource from a role instance by using the `remove` method.

```ts
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
}); // returns a new role instance

role.getResources() // ['user', 'post']
updated.getResources() // ['user']
```

The `remove` method allows you to remove a resource from a role instance. It takes an `removeOptions` object as its parameter, which includes the following properties:

* `resource` (string): The name of the resource to remove from the role.
* `mutate` (boolean, default: `false`): Optional. If set to `true`, the `remove` method will mutate the existing role instance instead of returning a new instance with the specified resource removed.

The `remove` method returns a new role instance with the specified resource removed. You can use the `getResources` method on the role instance to retrieve the list of remaining resources.

Please note that the example usage provided demonstrates the expected behavior of the `remove` method and its interaction with the resulting role instances

### Check permissions

The Role class provides several convenient check methods to verify permissions for specific resources and actions. These methods allow you to control access and make authorization decisions based on the capabilities of a role.

#### `can(resource: string, action: string): boolean`

Check if the role has permission to perform the specified action on the given resource.

```typescript
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

role.can('user', 'ban');
// Returns: false
```

The `can` method takes two parameters: `resource` (string) and `action` (string), representing the resource name and the action to be checked, respectively. It returns a boolean value indicating whether the role has permission to perform the action on the resource.

#### `cannot(resource: string, action: string): boolean`

Check if the role does not have permission to perform the specified action on the given resource.

```typescript
role.cannot('user', 'ban');
// Returns: true
```

The `cannot` method takes two parameters: `resource` (string) and `action` (string), representing the resource name and the action to be checked, respectively. It returns a boolean value indicating whether the role does not have permission to perform the action on the resource.

#### `canAny(resource: string, actions: string[]): boolean`

Check if the role has permission to perform any of the specified actions on the given resource.

```typescript
role.canAny('post', ['create', 'read']);
// Returns: true
```

The `canAny` method takes two parameters: `resource` (string) and `actions` (string array), representing the resource name and an array of actions to be checked, respectively. It returns a boolean value indicating whether the role has permission to perform any of the actions on the resource.

#### `canAll(resource: string, actions: string[]): boolean`

Check if the role has permission to perform all of the specified actions on the given resource.

```typescript
role.canAll('post', ['create', 'read']);
// Returns: false
```

The `canAll` method takes two parameters: `resource` (string) and `actions` (string array), representing the resource name and an array of actions to be checked, respectively. It returns a boolean value indicating whether the role has permission to perform all of the actions on the resource.

These check methods provide a straightforward way to determine the permissions of a role for specific resources and actions. You can use them to implement fine-grained access control and make informed authorization decisions based on the capabilities of each role.

### Authorization Management with Auth Manager

The Auth Manager class provides a powerful way to manage authorization and perform access control based on roles and their permissions. It allows you to define roles, create an authorization schema, and check authorization for specific actions and resources.

#### Step 1: Define Roles

In the code snippet, two roles, namely `user` and `admin`, are defined using the Role class. Each role is configured with specific permissions for different resources and actions.

```typescript
import { AuthManager, Role, Schema } from '@iamjs/core';
 
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
        }
      }
    })
  };
```

#### Step 2: Create an Authorization Schema

To manage authorization, a schema is created using the Schema class and initialized with the defined roles.

```typescript
  const schema = new Schema({ roles });
  const auth = new AuthManager(schema);
```

#### Step 3: Manage Authorization

The Auth Manager class enables you to perform authorization checks using the `authorize` method. It takes an authorization request object with the following properties:

* `role` (string, optional if `construct` is true): The name of the role to check authorization against.
* `actions` (string\[]): An array of actions to check authorization for.
* `resources` (string | string\[]): The name or an array of names of the resources to check authorization against.
* `strict` (boolean, optional): If set to `true`, strict mode is enabled, meaning all resources must be authorized. Defaults to `false`.
* `construct` (boolean, optional if `role` is not null): If is set to true the role will be constructed on the fly from the provided data which is the json string or a plain javascript object of the role.
* `data` (string | object, optional if `role` is not null): The data to construct the role from.

**Example Usage:**

```typescript
const isAdminAuthorized = auth.authorize({
  role: 'admin',
  actions: ['ban', 'create'],
  resources: 'user'
}); // true

const isUserAuthorized = auth.authorize({
  role: 'user',
  actions: ['read', 'create'],
  resources: ['post', 'user'],
  strict: true
}); // false
```

In the example above, the `isAdminAuthorized` variable checks if the `admin` role has authorization to perform the actions 'ban' and 'create' on the 'user' resource. The `isUserAuthorized` variable checks if the `user` role has authorization to perform the actions 'read' and 'create' on both the 'post' and 'user' resources in strict mode.

By using the Auth Manager, you can effectively manage authorization and perform fine-grained access control based on the defined roles and their permissions.

### Save and load roles

These `Role` instance methods provide flexibility and interoperability in working with role instances, allowing you to easily convert between different representations while maintaining the core role data and behavior.

#### `toObject`:

This method converts the current `Role` instance into a plain JavaScript object representation (`GetRoleConfig<T>`).

* It captures attributes such as name, description, meta, config, permissions, and resources.
* You can provide an optional `transform` function as a parameter to further process the resulting object. This can be useful for custom transformations or additional processing.
* If no `transform` function is provided, the method returns the plain object representation of the role.

#### `fromObject`:&#x20;

* Creates a new role instance from a plain JavaScript object representation.

#### `toJSON`:&#x20;

* This method converts the current `Role` instance into a JSON string representation.
* It gathers attributes like name, description, meta, and config.
* Similarly, you can pass a `transform` function as an argument to perform additional processing on the resulting JSON string.
* If no `transform` function is provided, the method returns the JSON string representation of the role.

#### `fromJSON`:&#x20;

* Creates a new role instance from a JSON string representation.

**`from`:**

* This method creates a new `Role` instance from external data by applying a transformation function.
* It's particularly useful when you want to create a `Role` instance from data of an unknown format or when you need to perform additional transformations on the input data before creating the role.
* The method takes two arguments:
  * `data`: The input data for creating the role instance.
  * `transform`: A function that converts the input data to a role configuration (compatible with `GetRoleConfig<T>`).
* The function returns a new `Role` instance created from the transformed data.
* An example use case is provided that demonstrates creating a role from encrypted data using a custom transformation function. This is especially helpful for scenarios where you need to preprocess the data before creating a `Role` instance.
* This method allows you to handle scenarios where the input data might require special handling or transformation before creating a `Role` instance, enhancing the flexibility and adaptability of your class.

These methods provide convenient ways to serialize and deserialize role instances, allowing you to store or transmit role data in different formats (such as objects or JSON strings) and recreate role instances from those formats when needed.

By using `toObject` and `fromObject`, you can convert a role instance to a plain object and recreate a role instance from that object, respectively. This can be useful when you want to store or transmit the role data as a plain JavaScript object.

Similarly, `toJSON` and `fromJSON` enable you to convert a role instance to a JSON string and create a role instance from that JSON string, respectively. This can be helpful when you need to serialize the role data for storage, transmission, or interoperability with other systems that expect JSON-formatted data.

### Convert a role to a json string

The `toJSON` method converts the role instance to a JSON string representation. It returns a JSON string that represents the same data as the role instance.

```typescript
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

// or you can use transform function to shape the output 
// for example you can encrypt the json string
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
```

### Convert a role to object

The `toObject` method converts the role instance to a plain JavaScript object representation. It returns a plain JavaScript object that represents the same data as the role instance.

```typescript
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

// or you can use transform function to shape the output
role.toObject((data) => {
return {
  ...data,
  otherKey: 'otherValue'
};
});

```
### Load a role from a json string

The `fromJSON` method creates a new role instance from a JSON string representation. It takes a JSON string parameter that represents the role instance and returns a new role instance based on the provided JSON string representation.

```typescript
const fromObject = Role.fromJSON<typeof role>(string);
```

### Load a role from an object

The `fromObject` method creates a new role instance from a plain JavaScript object representation. It takes an object parameter that represents the role instance and returns a new role instance based on the provided object representation.

```typescript
const fromObject = Role.fromObject(object);
```
### Create a role from an unknown data source

This method can be used when you want to create a role from an unknown data source

```typescript
import crypto from 'crypto';

const key = 'somekey';
const iv = 'someiv';
const algorithm = 'aes-256-cbc';
const key_buffer = Buffer.from(key);
const iv_buffer = Buffer.from(iv);

const encrypted_role_json_str = 'some encrypted data';

const decrypt = (data: string) => {
   const decipher = crypto.createDecipheriv(algorithm, key_buffer, iv_buffer);
   let decrypted = decipher.update(data, 'hex', 'utf8');
   decrypted += decipher.final('utf8');
   return decrypted;
};
const role = Role.from(encrypted_role_json_str, (data) => {
   const decrypted = decrypt(data); // decrypt the data
   return Role.fromJSON(decrypted).toObject(); // convert the decrypted data to a role object and return it
});
```
