# Validate a role

You can check if a role is valid using the `validate` method.

```javascript
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

Role.validate(role); // true

// or you can use a callback
role.validate((result, error) => {
  if (error) {
    console.log(error);
  } 
  console.log(result); // true
});
```

The `validate` method returns `true` if the role is valid and `false` otherwise. Additionally, you can use the callback function to handle errors that may occur during the validation process.
