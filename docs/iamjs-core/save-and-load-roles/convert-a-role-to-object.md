# Convert a role to object

The `toObject` method converts the role instance to a plain JavaScript object representation. It returns a plain JavaScript object that represents the same data as the role instance.

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

const object = role.toObject();
```
