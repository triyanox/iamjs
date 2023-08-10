import {
  IAuthManager,
  ISchema,
  Roles,
  TAuthPermissions,
  TAuthResources,
  TAutorizeOptions,
  TRoleOptions,
  permission
} from '../types';
import utils from '../utils';
import Role from './role';

/**
 * The `AuthManager` class
 */
class AuthManager<T extends Roles<T>> implements IAuthManager<T> {
  constructor(public schema: ISchema<T>) {}

  private _verifyPermissionsLoose<U extends TRoleOptions>(
    role: Role<U>,
    resources: Array<TAuthResources<U>>,
    action: Array<TAuthPermissions<U>>
  ): boolean {
    if (!role) return false;
    return action.some((action) => {
      return resources.some((resource) => {
        return role.can(resource, action as any);
      });
    });
  }
  private _verifyPermissionsStrict<U extends TRoleOptions>(
    role: Role<U>,
    resources: Array<TAuthResources<U>>,
    action: Array<TAuthPermissions<U>>
  ): boolean {
    if (!role) return false;
    return action.every((action) => {
      return resources.every((resource) => {
        return role.can(resource, action as any);
      });
    });
  }

  private _getRole<K extends keyof T>(name: K): T[K] {
    return this.schema.getRole(name);
  }
  private _construct(arg: object | string) {
    if (typeof arg === 'string') {
      return Role.fromJSON(arg);
    }
    if (typeof arg === 'object') {
      return Role.fromObject(arg as TRoleOptions);
    }
    throw 'Invalid argument for `_construct` method';
  }

  public authorize(options: TAutorizeOptions<T>): boolean {
    if ('role' in options) {
      const role = this._getRole(options.role);
      if (options.strict) {
        return this._verifyPermissionsStrict(
          role,
          utils.asArray(options.resources) as string[],
          utils.asArray(options.actions) as permission[]
        );
      }
      return this._verifyPermissionsLoose(
        role,
        utils.asArray(options.resources) as string[],
        utils.asArray(options.actions) as permission[]
      );
    }
    if ('construct' in options) {
      const role = this._construct(options.data);
      if (options.strict) {
        return this._verifyPermissionsStrict(
          role,
          utils.asArray(options.resources) as string[],
          utils.asArray(options.actions) as permission[]
        );
      }
      return this._verifyPermissionsLoose(
        role,
        utils.asArray(options.resources) as string[],
        utils.asArray(options.actions) as permission[]
      );
    }
    throw 'Invalid argument for `authorize` method';
  }
}

export default AuthManager;
