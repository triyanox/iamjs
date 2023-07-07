# Check permissions

The Role class provides several convenient check methods to verify permissions for specific resources and actions. These methods allow you to control access and make authorization decisions based on the capabilities of a role.

#### `can(resource: string, action: string): boolean`

Check if the role has permission to perform the specified action on the given resource.

```typescript
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
