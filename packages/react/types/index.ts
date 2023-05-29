import { IRole, permission, permissions } from '@iamjs/core';
import React from 'react';

interface PermissionProviderProps {
  children: React.ReactNode;
}

/**
 * Interface representing the type of the context object returned by the `PermissionContext` provider.
 */
interface PermissionContextType {
  /** The current set of permissions. */
  permissions: Record<string, Record<permission, boolean>>;

  /**
   * Sets the permissions for a given resource and permission(s).
   * @param resource The resource for which to set permissions.
   * @param permission The permission(s) to set.
   * @param grant Whether to grant or deny the permission(s).
   */
  setPerm: (resource: string, permission: permissions, grant: boolean) => void;

  /**
   * Gets the permissions for a given resource and permission(s).
   * @param resource The resource for which to get permissions.
   * A string representing a permission, which must be in one of the following formats:
   * -`{resource}:{actions}` where `resource` is a string and `actions` is a comma-separated list of CRUD actions (`create`, `read`, `update`, `delete`, and `list`)
   * -`{resource}` where `resource` is a string
   * @param permission Optional. The permission(s) to get. If omitted, all permissions for the resource are returned.
   * @example
   * ```ts
   * const canRead = usePerm("resource:read"); // returns true if the "read" action is allowed
   * const canCreateAndUpdate = usePerm("resource:create,update"); // comma-separated list of actions and return true if all actions are allowed
   * const canCreate = usePerm("resource", "create"); // returns true if the "create" action is allowed
   * ```
   * @returns The value of the requested permission(s), or an object containing all permissions for the resource.
   */
  getPerm: (resource: string, permission?: permissions) => boolean | Record<string, boolean>;

  /**
   * Sets the initial set of permissions based on the provided `IRole` object.
   * @param role The role object from which to derive the initial permissions.
   */
  setInitialPerm: (role: IRole | string) => Promise<void>;

  /**
   * Generates a JSON or object representation of the current set of permissions.
   * @param type The type of representation to generate.
   * @returns The JSON or object representation of the current set of permissions.
   */
  generate: (type: 'json' | 'object') => Record<string, Record<permission, boolean>> | string;
  /**
   * Show a component if the user has the specified permission(s).
   * @param resource The resource for which to get permissions.
   * * A string representing a permission, which must be in one of the following formats:
   * -`{resource}:{actions}` where `resource` is a string and `actions` is a comma-separated list of CRUD actions (`create`, `read`, `update`, `delete`, and `list`)
   * -`{resource}` where `resource` is a string
   * @param permission Optional. The permission(s) to get. If omitted, all permissions for the resource are returned.
   * @returns a boolean indicating whether the user can see the component.
   */
  show: (resource: string, permission?: permissions) => boolean;
  /**
   * A boolean indicating whether the permissions have been loaded.
   * @default false
   */
  isReady: boolean;
}

/**
 * The type of the `usePerm` hook.
 */
type usePermType = {
  /**
   * The current set of permissions.
   */
  permissions: Record<string, Record<permission, boolean>>;
  /**
   * Sets the permissions for a given resource and permission(s).
   * @param resource The resource for which to set permissions.
   * @param permission The permission(s) to set.
   * @param grant Whether to grant or deny the permission(s).
   */
  setPerm: (resource: string, permission: permissions, grant: boolean) => void;

  /**
   * Gets the permissions for a given resource and permission(s).
   * @param resource The resource for which to get permissions.
   * A string representing a permission, which must be in one of the following formats:
   * -`{resource}:{actions}` where `resource` is a string and `actions` is a comma-separated list of CRUD actions (`create`, `read`, `update`, `delete`, and `list`)
   * -`{resource}` where `resource` is a string
   * @param permission Optional. The permission(s) to get. If omitted, all permissions for the resource are returned.
   * @example
   * ```ts
   * const canRead = usePerm("resource:read"); // returns true if the "read" action is allowed
   * const canCreateAndUpdate = usePerm("resource:create,update"); // comma-separated list of actions and return true if all actions are allowed
   * const canCreate = usePerm("resource", "create"); // returns true if the "create" action is allowed
   * ```
   * @returns The value of the requested permission(s), or an object containing all permissions for the resource.
   */
  getPerm: (resource: string, permission?: permissions) => boolean | Record<string, boolean>;

  /**
   * Sets the initial set of permissions based on the provided `IRole` object.
   * @param role The role object from which to derive the initial permissions.
   */
  load: (role: IRole | string) => Promise<void>;

  /**
   * Generates a JSON or object representation of the current set of permissions.
   * @param type The type of representation to generate.
   * @returns The JSON or object representation of the current set of permissions.
   */
  generate: (type: 'json' | 'object') => Record<string, Record<permission, boolean>> | string;
  /**
   * Show a component if the user has the specified permission(s).
   * @param resource The resource for which to get permissions.
   * * A string representing a permission, which must be in one of the following formats:
   * -`{resource}:{actions}` where `resource` is a string and `actions` is a comma-separated list of CRUD actions (`create`, `read`, `update`, `delete`, and `list`)
   * -`{resource}` where `resource` is a string
   * @param permission Optional. The permission(s) to get. If omitted, all permissions for the resource are returned.
   * @returns a boolean indicating whether the user can see the component.
   */
  show: (resource: string, permission?: permissions) => boolean;
  /**
   * A boolean indicating whether the permissions have been loaded.
   * @default false
   */
  isReady: boolean;
};

export type { PermissionContextType, PermissionProviderProps, usePermType };
