# Show component based on permission

You can use the `show` function to show component based on permission.

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
  const { show } = usePerm(role);

  return (
    <>
      {show('books', 'create') && <div>Can create</div>}
      {show('books:create') && <div>Can create</div>}
      {show('books', ['create', 'read']) && <div>Can create and read</div>}
    </>
  );
};
```
