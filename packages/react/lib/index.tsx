import { IRole, Role, permission, permissions } from "@iamjs/core/lib";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  PermissionContextType,
  PermissionProviderProps,
  usePermType,
} from "@iamjs/react/types";

const PermissionContext = createContext<PermissionContextType>({
  permissions: {},
  setPerm: () => {},
  getPerm: () => false,
  setInitialPerm: () => {},
  generate: () => ({}),
  show: () => false,
});

/**
 * A React context provider that provides the current set of permissions and functions to set and get permissions.
 */
const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}: PermissionProviderProps) => {
  const [permissions, setPermissions] = useState<
    Record<string, Record<permission, boolean>>
  >({});

  const setPerm = (
    resource: string,
    permission: permissions,
    grant: boolean
  ) => {
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
    const [r, ...actions] = resource.split(":");
    const grantedActions = permissions?.[r];

    if (!grantedActions) {
      return false;
    }

    if (actions.length) {
      const actionList = actions[0].split(",");
      return actionList.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr]) ?? false;
        return acc;
      }, true);
    }

    if (Array.isArray(permission)) {
      return permission.reduce((acc, curr) => {
        acc[curr] = grantedActions[curr] ?? false;
        return acc;
      }, {} as Record<permission, boolean>);
    }

    return grantedActions[permission ?? ""] ?? false;
  };

  const setInitialPerm = (role: IRole | string) => {
    let init: IRole;

    if (typeof role === "string") {
      init = Role.fromJSON(role);
    }
    if (role instanceof Role) {
      init = role;
    }

    Role.validate(init, (result, err) => {
      if (!result) {
        throw err;
      }
    });

    setPermissions(
      init.toObject() as Record<string, Record<permission, boolean>>
    );
  };

  const generate = (type: "json" | "object") => {
    if (type === "json") {
      return JSON.stringify(permissions);
    }

    return permissions;
  };

  const show = (resource: string, permission?: permissions): boolean => {
    const [r, ...actions] = resource.split(":");
    const grantedActions = permissions?.[r];

    if (!grantedActions) {
      return false;
    }

    if (actions.length) {
      const actionList = actions[0].split(",");
      return actionList.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr]) ?? false;
        return acc;
      }, true);
    }

    if (Array.isArray(permission)) {
      return permission.reduce((acc, curr) => {
        acc = (acc && grantedActions[curr]) ?? false;
        return acc;
      }, true);
    }

    return grantedActions[permission ?? ""] ?? false;
  };

  return (
    <PermissionContext.Provider
      value={{ permissions, generate, setPerm, getPerm, setInitialPerm, show }}
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
  const { permissions, setPerm, getPerm, setInitialPerm, generate, show } =
    useContext(PermissionContext);
  useEffect(() => {
    if (role) {
      setInitialPerm(role);
    }
  }, [role]);

  return {
    permissions,
    setPerm,
    getPerm,
    load: setInitialPerm,
    generate,
    show,
  };
};

export { PermissionProvider, usePerm };
export type { PermissionContextType, PermissionProviderProps, usePermType };
