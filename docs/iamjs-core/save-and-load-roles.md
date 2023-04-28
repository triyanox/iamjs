# Save and load roles

You can save a role to a JSON file using the `generate` method.

```ts
import { Role } from '@iamjs/core';

const role = new Role([
  {
    resource: 'user',
    scopes: 'cr---',
  },
]);

role.generate('json'); // json string
role.generate('object'); // javascript object
```

You can load a role from a JSON file using the `fromJSON` or `fromObject` method.

```ts
import { Role } from '@iamjs/core';

const roleFromJSON = Role.fromJSON('json string'); 
const roleFromObject = Role.fromObject('javascript object'); 
```
