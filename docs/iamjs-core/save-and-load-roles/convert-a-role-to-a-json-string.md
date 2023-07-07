# Convert a role to a json string

The `toJSON` method converts the role instance to a JSON string representation. It returns a JSON string that represents the same data as the role instance.

```typescript
const role = new Role({
    name: 'role',
    config: {
        user: {
            scopes: 'crudl',
            custom: {
                ban: false
            }
        },
        post: {
            scopes: '-rudl',
            custom: {
                publish: true
            }
        }
    }
});

const string = role.toJSON();
```
