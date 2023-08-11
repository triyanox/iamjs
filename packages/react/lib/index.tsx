import { AuthManager, Role, Roles, Schema, TRoleOptions } from '@iamjs/core';
import { Fragment } from 'react';
import {
  Actions,
  Resources,
  TBuildShowProps,
  TShowProps,
  useAuthorizationReturnType
} from '../types';

/**
 * Create schema from roles object
 * @param roles - Roles object
 * @returns Schema object
 */
const createSchema = <
  T extends {
    [K in keyof T]: T[K] extends Role<infer U> ? Role<U> : never;
  }
>(
  roles: T
): Schema<T> => {
  const schema = new Schema<T>({
    roles
  });
  return schema;
};

/**
 * `@imajs` React hook for authorization
 * @param schema - Schema object
 * @returns Authorization object
 */
const useAuthorization = <T extends Roles<T>>(schema: Schema<T>): useAuthorizationReturnType<T> => {
  const authManager = new AuthManager(schema);

  function can(role: keyof T, resources: Resources<T>, actions: Actions<T>, strict = false) {
    return authManager.authorize({
      role,
      resources,
      actions,
      strict
    });
  }
  function build<U extends TRoleOptions>(init: U | string) {
    let role: Role<U> = {} as Role<U>;
    if (typeof init === 'string') {
      role = Role.fromJSON<U>(init) as unknown as Role<U>;
    }
    if (typeof init === 'object') {
      role = Role.fromObject(init) as unknown as Role<U>;
    }

    function can(resources: Resources<T>, actions: Actions<T>, strict = false) {
      if (!(role instanceof Role)) {
        return false;
      }
      return authManager.authorize({
        data: role?.toObject(),
        construct: true,
        resources,
        actions,
        strict
      });
    }
    const Show = ({
      children,
      resources,
      actions,
      strict = false
    }: TBuildShowProps<T>): JSX.Element | null => {
      if (!(role instanceof Role)) {
        return null;
      }
      const can = authManager.authorize({
        data: role.toObject(),
        construct: true,
        resources,
        actions,
        strict
      });
      if (can) {
        return <Fragment>{children}</Fragment>;
      }
      return null;
    };

    return {
      can,
      Show,
      role
    };
  }

  const Show = ({
    children,
    role,
    resources,
    actions,
    strict = false
  }: TShowProps<T>): JSX.Element | null => {
    const can = authManager.authorize({
      role,
      resources,
      actions,
      strict
    });
    if (can) {
      return <Fragment>{children}</Fragment>;
    }
    return null;
  };

  return {
    authorize: authManager.authorize,
    use: schema.getRole,
    can,
    Show,
    build
  };
};

export { createSchema, useAuthorization };
export type { Actions, Resources, TBuildShowProps, TShowProps, useAuthorizationReturnType };
