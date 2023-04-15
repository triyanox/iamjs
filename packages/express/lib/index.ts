import { NextFunction, Request, Response } from 'express';
import { AuthError, AuthManager } from '@iamjs/core';
import { IExpressAutorizeOptions, IExpressRoleManager, IExpressRoleManagerOptions } from '../types';

class ExpressRoleManager extends AuthManager implements IExpressRoleManager {
  onError?: <T extends Request, U extends Response = Response>(
    err: AuthError,
    req: T,
    res: U,
    next: NextFunction
  ) => void;
  onSucess?: <T extends Request, U extends Response = Response>(
    req: T,
    res: U,
    next: NextFunction
  ) => void;

  constructor(options: IExpressRoleManagerOptions) {
    super(options);
    this.onError = options.onError;
    this.onSucess = options.onSucess;
  }

  private _getRoleFromRequest(req: Request, roleKey: string): string {
    const role = req[roleKey as keyof Request];
    if (!role) {
      throw AuthError.throw_error('INVALID_ROLE');
    }
    return role;
  }

  private _getPermissionsFromRequest(req: Request, permissionsKey: string): any {
    const permissions = req[permissionsKey as keyof Request];
    if (!permissions) {
      throw AuthError.throw_error('INVALID_PERMISSIONS');
    }
    return permissions;
  }

  public authorize<T extends Request, U extends Response = Response>(
    options: IExpressAutorizeOptions
  ): (req: T, res: U, next: NextFunction) => void {
    return (req: T, res: U, next: NextFunction) => {
      try {
        let authorized = false;
        if (!options.usePermissionKey) {
          const role = this._getRoleFromRequest(req, options.roleKey || 'role');
          authorized = this.authorizeRole({
            role,
            action: options.action,
            resource: options.resource,
            loose: options.loose
          });
        } else {
          const permissions = this._getPermissionsFromRequest(
            req,
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
        if (authorized) {
          if (this.onSucess) {
            this.onSucess<T, U>(req, res, next);
          } else {
            next();
          }
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        if (this.onError) {
          this.onError<T, U>(error, req, res, next);
        } else {
          next(error);
        }
      }
    };
  }
}

export { ExpressRoleManager };
export type { IExpressRoleManager, IExpressRoleManagerOptions, IExpressAutorizeOptions };
