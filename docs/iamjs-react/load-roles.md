# Load roles

You can also load the role using the `load` function from the `usePerm` hook or pass the role json directly to `usePerm` hook.

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
  const { load } = usePerm();
  // or you can directly pass the role to usePerm hook
  const { ... } = usePerm(role);

  const handleLoadRole = () => {
    load(role);
    // or you can directly pass the role json if you are getting the role from the server
    load(role.toJSON());
  };

  return (
    <>
      <button onClick={handleLoadRole}>
        Load Role
      </button>
    </>
  );
};
```
