import { IAuthManager, IAuthManagerOptions, IAutorizeOptions, IRole, permission } from '../types';
import AuthError from './AuthError';
import Role from './Role';

/**
 * The AuthManager class
 */
export default class AuthManager implements IAuthManager {
  roles: Map<string, IRole>;
  resources: Set<string>;

  constructor(options: IAuthManagerOptions) {
    this.roles = new Map(Object.entries(options.roles));
    this.resources = new Set(options.resources);
  }

  private _checkRole(role: string): boolean {
    return this.roles.has(role);
  }

  private _checkResource(resource: string | string[]): boolean {
    if (Array.isArray(resource)) {
      return resource.every((r) => this.resources.has(r));
    }
    return this.resources.has(resource);
  }

  private _getRole(role: string, constructRole?: boolean, permissions?: any): IRole {
    try {
      let roleObject: IRole | undefined;
      if (constructRole) {
        roleObject = Role.fromObject(permissions);
        if (!roleObject) {
          throw new AuthError('INVALID_PERMISSIONS');
        }
        return roleObject;
      }
      roleObject = this.roles.get(role);
      if (!roleObject) {
        throw new AuthError('INVALID_ROLE');
      }
      return roleObject;
    } catch (error) {
      throw AuthError.throw_unknown_error(error);
    }
  }

  private _verifyPermissionsStrict(
    role: IRole,
    actions: permission[],
    resources: string[]
  ): boolean {
    try {
      return actions.every((action) => {
        return resources.every((resource) => {
          return role.can(action, resource);
        });
      });
    } catch (error) {
      throw AuthError.throw_unknown_error(error);
    }
  }

  private _verifyPermissionsLoose(
    role: IRole,
    actions: permission[],
    resources: string[]
  ): boolean {
    try {
      const set = new Set();
      resources.forEach((resource) => {
        const hasRights = role.canAny(actions, resource);
        if (hasRights) {
          set.add(resource);
        }
      });
      return set.size > 0;
    } catch (error) {
      throw AuthError.throw_unknown_error(error);
    }
  }

  private _verifyOptions(options: IAutorizeOptions) {
    const { role, action, resource, constructRole, permissions, loose } = options;
    if (!action) throw AuthError.throw_error('MISSING_ACTION');
    if (!resource) throw AuthError.throw_error('MISSING_RESOURCE');
    if (!constructRole && !this._checkRole(role as string)) {
      throw AuthError.throw_error('INVALID_ROLE');
    }
    if (!this._checkResource(resource)) {
      throw AuthError.throw_error('INVALID_RESOURCE');
    }
    return {
      role,
      action,
      resource,
      constructRole,
      permissions,
      loose
    };
  }

  public authorizeRole(options: IAutorizeOptions): boolean {
    try {
      const { role, action, resource, constructRole, permissions, loose } =
        this._verifyOptions(options);
      const roleObject = this._getRole(role as string, constructRole, permissions);
      if (Array.isArray(action)) {
        if (Array.isArray(resource)) {
          if (loose) {
            return this._verifyPermissionsLoose(roleObject, action, resource);
          }
          return this._verifyPermissionsStrict(roleObject, action, resource);
        }
        if (loose) {
          return this._verifyPermissionsLoose(roleObject, action, [resource]);
        }
        return this._verifyPermissionsStrict(roleObject, action, [resource]);
      } else {
        if (Array.isArray(resource)) {
          if (loose) {
            return this._verifyPermissionsLoose(roleObject, [action], resource);
          }
          return this._verifyPermissionsStrict(roleObject, [action], resource);
        }
        if (loose) {
          return this._verifyPermissionsLoose(roleObject, [action], [resource]);
        }
        return this._verifyPermissionsStrict(roleObject, [action], [resource]);
      }
    } catch (error) {
      throw AuthError.throw_unknown_error(error);
    }
  }
}
