# Show component based on permission

The `show` function provided by the `usePerm` hook allows you to conditionally show or hide components based on the permissions of a given role. It takes two arguments: the resource and action(s) you want to check permissions for. If the role associated with the `usePerm` hook has permission to perform the specified action(s) on the specified resource, the function returns `true`, otherwise it returns `false`.

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

In the example code above, the `show` function is used to conditionally render three `div` elements based on the permissions of the `role` object. The first `div` will only be rendered if the role has permission to create books, the second `div` will only be rendered if the role has permission to create books using the `books:create` syntax, and the third `div` will only be rendered if the role has permission to create and read books.
