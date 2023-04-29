# Validate a role

You can check if a role is valid using the `validate` method.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

Role.validate(role); // true

// or you can use a callback
role.validate(role, (result, error) => {
  if (error) {
    console.log(error);
  } 
  console.log(result); // true
});
```
