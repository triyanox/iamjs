import { Actions, Resources, Role, Roles, TAutorizeOptions, TRoleOptions } from '@iamjs/core';

type TShowProps<T extends Roles<T>> = {
  role: keyof T;
  resources: Resources<T>;
  actions: Actions<T>;
  strict?: boolean;
  children: React.ReactNode;
};

type TBuildShowProps<T extends Roles<T>> = {
  resources: Resources<T>;
  actions: Actions<T>;
  strict?: boolean;
  children: React.ReactNode;
};

type useAuthorizationReturnType<T extends Roles<T>> = {
  /**
   * Check if user has permission to access resource
   * @param role - Role name
   * @param resources - Resources string or array of resources
   * @param actions - Actions string or array of actions
   * @param strict - Strict mode (default: false)
   * @returns boolean
   */
  can: (role: keyof T, resources: Resources<T>, actions: Actions<T>, strict?: boolean) => boolean;
  /**
   * This method is used to check the permissions of a role on a resource
   */
  authorize: (options: TAutorizeOptions<T>) => boolean;
  /**
   * Get a role from the schema with all its methods
   */
  use: (role: keyof T) => T[keyof T];
  /**
   * Renders children if user has permission to access resource
   */
  Show: (props: TShowProps<T>) => JSX.Element | null;
  /**
   * Builds a role from a `json` or `object` and returns a role with all its methods
   */
  build: <U extends TRoleOptions>(init: U | string) => TBuildReturnType<T, U>;
};

type TBuildReturnType<T extends Roles<T>, U extends TRoleOptions> = {
  /**
   * This method is used to check the permissions of a role on a resource
   */
  can: (resources: Resources<T>, actions: Actions<T>, strict?: boolean) => boolean;
  /**
   * Renders children if user has permission to access resource
   */
  Show: (props: TBuildShowProps<T>) => JSX.Element | null;
  /**
   * The constructed role
   */
  role: Role<U>;
};
export type { Actions, Resources, TBuildShowProps, TShowProps, useAuthorizationReturnType };
