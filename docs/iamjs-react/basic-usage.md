# Basic usage

The `usePerm` hook from `@iamjs/react` allows you to get or set permissions for a role in a React component.

To use the `usePerm` hook, first create a role object using the `Role` class from `@iamjs/core`.

Then, wrap your component hierarchy with a `PermissionProvider` component from `@iamjs/react`.

```jsx
import { usePerm, PermissionProvider } from '@iamjs/react';
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'books',
    scopes: '----l'
  }
]);

const App = () => {
  return (
    <PermissionProvider>
      <Component />
    </PermissionProvider>
  );
};
```

In your component, use the `usePerm` hook to access the permissions for the role. The `usePerm` hook returns an object which includes: `getPerm` and `setPerm`.

```jsx
const Component = () => {
  const { setPerm, getPerm } = usePerm(role);

  const handleSetPerm = () => {
    setPerm('books', 'create', true);
    setPerm('books', ['create', 'read'], true);
  }; 

  return (
    <>
      <div> 
        {getPerm('books', 'create').toString()}
        {getPerm('books:create').toString()}
        {getPerm('books', ['create', 'read']).toString()}
      </div>
      <button onClick={handleSetPerm}>
        Set Permission
      </button>
    </>
  );
};
```

You can use `getPerm` to check the value of a specific permission for a given resource and action. You can pass in either a string in the format `'resource:action'` or separate arguments for the resource and action.

To set a permission, use `setPerm` and pass in the resource, action, and the new permission value. You can also set permissions for multiple actions at once by passing in an array of actions.

Note that the `setPerm` function does not persist changes to a database or storage. If you need to persist changes, you will need to handle that separately.

The `usePerm` hook returns an object with the following properties:

| Property      | Type                                                                                       | Description                                  |
| ------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `getPerm`     | `(resource: string, permission: string \| string[]) => boolean \| Record<string, boolean>` | Get permission or permission for a resource. |
| `setPerm`     | `(resource: string, permission: string \| string[], grant: boolean) => void`               | Set permission or permission for a resource. |
| `show`        | `(resource: string, scope: string \| string[]) => boolean`                                 | Show component based on permission.          |
| `load`        | `(role: Role \| RoleJSON) => void`                                                         | Load role.                                   |
| `permissions` | `Record<string, Record<permission, boolean>>`                                              | Get all permissions.                         |
| `generate`    | `(type: 'json' \| 'object')`                                                               | Generate the updated permission string.      |
