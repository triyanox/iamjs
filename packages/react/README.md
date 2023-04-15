<img src="https://raw.githubusercontent.com/triyanox/iamjs/main/assets/logo.png" alt="iamjs logo" title="iamjs" align="right" height="50" width="50"/>

# `iamjs/react`

This package contains the react hook for iamjs a library for easy role and permissions management for your application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic usage](#basic-usage)
  - [Show component based on permission](#show-component-based-on-permission)
  - [Load role](#load-role)
  - [Generate updated permission string](#generate-updated-permission-string)
- [License](#license)

## Installation

```bash
npm install @iamjs/core @iamjs/react
```

or

```bash
yarn add @iamjs/core @iamjs/react
```

## Usage

### Basic usage

You can use the `usePerm` hook to get or set permissions for a role.

The `usePerm` hook returns an object with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `getPerm` | `(resource: string, permission: string \| string[]) => boolean | Record<string, boolean>` | Get permission or permission for a resource. |
| `setPerm` | `(resource: string, permission: string \| string[], grant: boolean) => void` | Set permission or permission for a resource. |
| `show` | `(resource: string, scope: string \| string[]) => boolean` | Show component based on permission. |
| `load` | `(role: Role \| RoleJSON) => void` | Load role. |
| `permissions` | `Record<string, Record<permission, boolean>>` | Get all permissions. |
| `generate` | `(type: 'json' \| 'object')` | Generate the updated permission string. |

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
  const { setPerm, getPerm } = usePerm(role);

  const handleSetPerm = () => {
    setPerm('books', 'create', true);
    setPerm('books', ['create', 'read'], true);
  }; 

  return (
    <>
      <div> 
        {getPerm('books', 'create').toString()}
        {getPerm('books:create').toString()}
        {getPerm('books', ['create', 'read']).toString()}
      </div>
      <button onClick={handleSetPerm}>
        Set Permission
      </button>
    </>
  );
};
```

### Show component based on permission

You can use the `show` function to show component based on permission.

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
  const { getPerm } = usePerm(role);

  return (
    <>
      {show('books', 'create') && <div>Can create</div>}
      {show('books:create') && <div>Can create</div>}
      {show('books', ['create', 'read']) && <div>Can create and read</div>}
    </>
  );
};
```

### Load role

You can also load the role using the `load` function from the `usePerm` hook or pass the role json directly to `usePerm` hook.

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
  const { load } = usePerm();
  // or you can directly pass the role to usePerm hook
  // const { show } = usePerm(role);

  const handleLoadRole = () => {
    load(role);
    // or you can directly pass the role json if you are getting the role from the server
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

### Generate updated permission string

You can use the `generate` function to generate the updated permission string and send it to the server.

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

## License

[MIT](https://github.com/triyanox/iamjs/blob/main/LICENSE)
