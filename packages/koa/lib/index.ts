import { AuthError, AuthManager } from '@iamjs/core';
import { Context, Next } from 'koa';
import {
  ActivityCallbackOptions,
  IKoaAutorizeOptions,
  IKoaRoleManager,
  IKoaRoleManagerOptions
} from '../types';

/**
 * The class that is used to manage roles and permissions for `Koa`
 * @extends AuthManager
 */
class KoaRoleManager extends AuthManager implements IKoaRoleManager {
  onError?: <T extends Context>(err: AuthError, ctx: T, next: Next) => Promise<void> | void;
  onSucess?: <T extends Context>(ctx: T, next: Next) => Promise<void> | void;
  onActivity?: <T extends Context>(options: ActivityCallbackOptions<T>) => Promise<void>;

  constructor(options: IKoaRoleManagerOptions) {
    super(options);
    this.onError = options.onError;
    this.onSucess = options.onSucess;
    this.onActivity = options.onActivity;
  }

  private _getRoleFromRequest(ctx: Context, roleKey: string): string {
    const role = ctx[roleKey as keyof Context];
    if (!role) {
      throw AuthError.throw_error('INVALID_ROLE');
    }
    return role;
  }

  private _getPermissionsFromRequest(ctx: Context, permissionsKey: string): any {
    const permissions = ctx[permissionsKey as keyof Context];
    if (!permissions) {
      throw AuthError.throw_error('INVALID_PERMISSIONS');
    }
    return permissions;
  }

  public authorize<T extends Context>(
    options: IKoaAutorizeOptions
  ): (ctx: T, next: Next) => Promise<void> | void {
    return async (ctx: T, next: Next) => {
      try {
        let authorized = false;
        if (!options.usePermissionKey) {
          const role = this._getRoleFromRequest(ctx, options.roleKey || 'role');
          authorized = this.authorizeRole({
            role,
            action: options.action,
            resource: options.resource,
            loose: options.loose
          });
        } else {
          const permissions = this._getPermissionsFromRequest(
            ctx,
            options.permissionsKey || 'permissions'
          );
          authorized = this.authorizeRole({
            permissions,
            action: options.action,
            resource: options.resource,
            loose: options.loose,
            constructRole: true
          });
        }
        if (!authorized) throw AuthError.throw_error('UNAUTHORIZED');
        if (this.onActivity) {
          await this.onActivity<T>({
            ctx,
            action: options.action,
            resource: options.resource,
            role: this._getRoleFromRequest(ctx, options.roleKey || 'role'),
            success: true
          });
        }
        if (this.onSucess) {
          this.onSucess<T>(ctx, next);
        } else {
          await next();
        }
      } catch (err: any) {
        if (this.onActivity) {
          await this.onActivity<T>({
            ctx,
            action: options.action,
            resource: options.resource,
            role: this._getRoleFromRequest(ctx, options.roleKey || 'role'),
            success: false
          });
        }
        if (this.onError) {
          this.onError<T>(err, ctx, next);
        } else {
          throw err;
        }
      }
    };
  }
}

export { KoaRoleManager };
export type {
  IKoaAutorizeOptions,
  IKoaRoleManager,
  IKoaRoleManagerOptions,
  ActivityCallbackOptions
};
