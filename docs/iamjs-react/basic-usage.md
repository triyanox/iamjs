# Basic usage

You can use the `usePerm` hook to get or set permissions for a role.

The `usePerm` hook returns an object with the following properties:

| Property      | Type                                                                                       | Description                                  |
| ------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `getPerm`     | `(resource: string, permission: string \| string[]) => boolean \| Record<string, boolean>` | Get permission or permission for a resource. |
| `setPerm`     | `(resource: string, permission: string \| string[], grant: boolean) => void`               | Set permission or permission for a resource. |
| `show`        | `(resource: string, scope: string \| string[]) => boolean`                                 | Show component based on permission.          |
| `load`        | `(role: Role \| RoleJSON) => void`                                                         | Load role.                                   |
| `permissions` | `Record<string, Record<permission, boolean>>`                                              | Get all permissions.                         |
| `generate`    | `(type: 'json' \| 'object')`                                                               | Generate the updated permission string.      |

```tsx
import { usePerm, PermissionProvider } from '@iamjs/react';

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
