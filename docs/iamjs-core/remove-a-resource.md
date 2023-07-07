# Remove a resource

You can remove a resource from a role instance by using the `remove` method.

```ts
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

const updated = role.remove({
    resource: 'post'
}); // returns a new role instance

role.getResources() // ['user', 'post']
updated.getResources() // ['user']
```

The `remove` method allows you to remove a resource from a role instance. It takes an `removeOptions` object as its parameter, which includes the following properties:

* `resource` (string): The name of the resource to remove from the role.
* `mutate` (boolean, default: `false`): Optional. If set to `true`, the `remove` method will mutate the existing role instance instead of returning a new instance with the specified resource removed.

The `remove` method returns a new role instance with the specified resource removed. You can use the `getResources` method on the role instance to retrieve the list of remaining resources.

Please note that the example usage provided demonstrates the expected behavior of the `remove` method and its interaction with the resulting role instances
