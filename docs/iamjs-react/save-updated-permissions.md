# Save updated permissions

You can use the `generate` function to generate the updated permissions string and send it to the server.

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
  const { generate } = usePerm(role);

  const handleGenerate = () => {
    const updatedRole = generate('json');
    // or
    const updatedRole = generate('object');
  };

  return (
    <>
      <button onClick={handleGenerate}>
        Generate
      </button>
    </>
  );
};
```
