import { AuthError, AuthManager } from '@iamjs/core';
import { IKoaAutorizeOptions, IKoaRoleManager, IKoaRoleManagerOptions } from '../types';
import { Context, Next } from 'koa';

class KoaRoleManager extends AuthManager implements IKoaRoleManager {
  onError?: <T extends Context>(err: AuthError, ctx: T, next: Next) => Promise<void> | void;
  onSucess?: <T extends Context>(ctx: T, next: Next) => Promise<void> | void;

  constructor(options: IKoaRoleManagerOptions) {
    super(options);
    this.onError = options.onError;
    this.onSucess = options.onSucess;
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
        if (!authorized) {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
        if (this.onSucess) {
          this.onSucess<T>(ctx, next);
        } else {
          await next();
        }
      } catch (err: any) {
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
export type { IKoaRoleManager, IKoaRoleManagerOptions, IKoaAutorizeOptions };
