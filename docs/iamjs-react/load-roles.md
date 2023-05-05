# Load roles

Sometimes, you may want to dynamically load a role based on user input or data from the server. In these cases, you can use the `load` function provided by the `usePerm` hook to load a role into the permission system.

Here's an example of how to use the `load` function:

```javascript
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
  // Or you can directly pass the role to usePerm hook
  const { ... } = usePerm(role);

  const handleLoadRole = () => {
    load(role);
    // Or you can directly pass the role json if you are getting the role from the server
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

In the example above, we create a `Role` object and use it in the `usePerm` hook. We then define a `handleLoadRole` function that calls the `load` function to load the `Role` object. Alternatively, you can also pass the role JSON directly to the `load` function if you are getting the role from the server.

By using the `load` function, you can dynamically load roles into the permission system and allow users to have different levels of access based on their roles.
