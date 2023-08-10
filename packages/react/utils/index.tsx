import { Role } from '@iamjs/core';
import { createSchema, useAuthorization } from '@iamjs/react';

const schema = createSchema({
  user: new Role({
    name: 'user',
    description: 'User role',
    meta: {
      name: 'user'
    },
    config: {
      books: {
        base: 'crudl',
        custom: {
          upgrade: true,
          downgrade: false,
          sort: true
        }
      }
    }
  })
});

const CanComponent = () => {
  const { can } = useAuthorization(schema);

  return (
    <div data-testid="books-create-permission">{can('user', 'books', 'create').toString()}</div>
  );
};

const TestShowComponent = () => {
  const { Show } = useAuthorization(schema);

  return (
    <Show role="user" resources="books" actions="create">
      <div data-testid="books-create-permission">true</div>
    </Show>
  );
};

const TestBuildRole = () => {
  const { build } = useAuthorization(schema);
  const { can } = build(
    schema
      .getRole('user')
      .update({
        resource: 'books',
        permissions: {
          base: '-----'
        }
      })
      .toObject()
  );
  return <div data-testid="books-create-permission">{can('books', 'create').toString()}</div>;
};

export { CanComponent, TestBuildRole, TestShowComponent };
