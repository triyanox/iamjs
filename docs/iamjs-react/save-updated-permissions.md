# Save updated permissions

The `generate` function creates a string representation of the updated role that can be sent to the server to update the user's permissions. It takes a single argument that specifies the format of the output. The available options are `'json'` and `'object'`.

The `'json'` option generates a JSON string that represents the updated role. This string can be sent to the server using an HTTP request, for example. The `'object'` option generates a JavaScript object that represents the updated role. This object can be manipulated in JavaScript code before being sent to the server.

The `generate` function is useful when you want to update a user's permissions and need to send the updated permissions to a server. For example, suppose a user requests access to a new resource that they are not currently authorized to access. The server might respond by updating the user's permissions to include the new resource. The `generate` function can be used to create a representation of the updated role that can be sent to the server to make the update.

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
