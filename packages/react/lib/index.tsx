import { IRole, Role, permission, permissions } from '@iamjs/core';
import React from 'react';
import { PermissionContextType, PermissionProviderProps, usePermType } from '../types';

const PermissionContext = React.createContext<PermissionContextType>({
  permissions: {},
  setPerm: () => { },
  getPerm: () => false,
  setInitialPerm: () => Promise.resolve(),
  generate: () => ({}),
  show: () => false,
  isReady: false
});

/**
 * A React context provider that provides the current set of permissions and functions to set and get permissions.
 */
const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children
}: PermissionProviderProps) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [permissions, setPermissions] = React.useState<Record<string, Record<permission, boolean>>>(
    {}
  );

  const setInitialPerm = (role: IRole | string): Promise<void> => {
    return new Promise((resolve) => {
      let init: IRole = {} as IRole;
      if (typeof role === 'string') {
        init = Role.fromJSON(role);
      }
      if (typeof role === 'object') {
        init = role;
      }
      Role.validate(init, (result, err) => {
        if (!result) {
          throw err;
        }
      });
      setPermissions(init.toObject() as Record<string, Record<permission, boolean>>);
      setIsReady(true);
      resolve();
    });

  };

  const setPerm = (resource: string, permission: permissions, grant: boolean) => {
    if (!isReady) return
    const newPermissions = { ...permissions };
    if (!newPermissions[resource]) {
      newPermissions[resource] = {} as Record<permission, boolean>;
    }
    if (Array.isArray(permission)) {
      permission.forEach((p) => {
        newPermissions[resource][p] = grant;
      });
    } else {
      newPermissions[resource][permission] = grant;
    }
    setPermissions(newPermissions);
  };

  const getPerm = (resource: string, permission?: permissions) => {
    if (!isReady) return false;
    const [r, ...actions] = resource.split(':');
    const grantedActions = permissions?.[r];

    if (!grantedActions) {
      return false;
    }

    if (actions.length) {
      const actionList = actions[0].split(',');
      return actionList.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr as permission]) ?? false;
        return acc;
      }, true);
    }

    if (Array.isArray(permission)) {
      return permission.reduce((acc, curr) => {
        acc[curr] = grantedActions[curr] ?? false;
        return acc;
      }, {} as Record<permission, boolean>);
    }

    return grantedActions[permission ?? ('' as permission)] ?? false;
  };

  const generate = (type: 'json' | 'object') => {
    if (!isReady) return type === 'json' ? '{}' : {};
    if (type === 'json') {
      return JSON.stringify(permissions);
    }

    return permissions;
  };

  const show = (resource: string, permission?: permissions): boolean => {
    if (!isReady) return false;
    const [r, ...actions] = resource.split(':');
    const grantedActions = permissions?.[r];

    if (!grantedActions) {
      return false;
    }

    if (actions.length) {
      const actionList = actions[0].split(',');
      return actionList.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr as permission]) ?? false;
        return acc;
      }, true);
    }

    if (Array.isArray(permission)) {
      return permission.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr]) ?? false;
        return acc;
      }, true);
    }

    return grantedActions[permission ?? ('' as permission)] ?? false;
  };

  return (
    <PermissionContext.Provider
      value={{ permissions, generate, setPerm, getPerm, setInitialPerm, show, isReady }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

/**
 * A custom hook that provides access to the permission context values.
 * @param {IRole} role - An optional role object to set initial permissions.
 * @returns {{permissions: Record<string, Record<permission, boolean>>, setPerm: Function, getPerm: Function, load: Function, generate: Function}} An object containing permission related functions and values.
 */
const usePerm = (role?: IRole | string): usePermType => {
  const { permissions, setPerm, getPerm, setInitialPerm, generate, show, isReady } =
    React.useContext(PermissionContext);
  React.useEffect(() => {
    if (role) {
      setInitialPerm(role);
    }
  }, [role]);

  return {
    isReady,
    permissions,
    setPerm,
    getPerm,
    load: setInitialPerm,
    generate,
    show
  };
};

export { PermissionProvider, usePerm };
export type { PermissionContextType, PermissionProviderProps, usePermType };

