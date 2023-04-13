import { AuthError, AuthManager } from "@iamjs/core/lib";
import { NextApiRequest, NextApiResponse } from "next";
import {
  INextAutorizeOptions,
  INextRoleManager,
  INextRoleManagerOptions,
} from "@iamjs/next/types";

/**
 * The class that is used to manage roles and permissions
 * @extends AuthManager
 */
class NextRoleManager extends AuthManager implements INextRoleManager {
  onError?: <
    T extends NextApiRequest,
    U extends NextApiResponse = NextApiResponse
  >(
    err: AuthError,
    req: T,
    res: U
  ) => Promise<void> | void;
  onSucess?: <
    T extends NextApiRequest,
    U extends NextApiResponse = NextApiResponse
  >(
    req: T,
    res: U
  ) => Promise<void> | void;

  constructor(options: INextRoleManagerOptions) {
    super(options);
    this.onError = options.onError;
    this.onSucess = options.onSucess;
  }

  private _getRoleFromRequest(req: NextApiRequest, roleKey: string): string {
    const role = req[roleKey as keyof NextApiRequest];
    if (!role) {
      throw AuthError.throw_error("INVALID_ROLE");
    }
    return role;
  }

  private _getPermissionsFromRequest(
    req: NextApiRequest,
    permissionsKey: string
  ): any {
    const permissions = req[permissionsKey as keyof NextApiRequest];
    if (!permissions) {
      throw AuthError.throw_error("INVALID_PERMISSIONS");
    }
    return permissions;
  }

  public authorize<
    T extends NextApiRequest,
    U extends NextApiResponse = NextApiResponse
  >(
    options: INextAutorizeOptions,
    handler: (req: T, res: U) => Promise<void> | void
  ): (req: T, res: U) => Promise<void> | void {
    return (req: T, res: U) => {
      try {
        let authorized = false;
        if (!options.usePermissionKey) {
          const role = this._getRoleFromRequest(req, options.roleKey || "role");
          authorized = this.authorizeRole({
            role,
            action: options.action,
            resource: options.resource,
            loose: options.loose,
          });
        } else {
          const permissions = this._getPermissionsFromRequest(
            req,
            options.permissionsKey || "permissions"
          );
          authorized = this.authorizeRole({
            permissions,
            action: options.action,
            resource: options.resource,
            loose: options.loose,
            constructRole: true,
          });
        }
        if (authorized) {
          if (this.onSucess) {
            this.onSucess<T, U>(req, res);
          } else {
            handler(req, res);
          }
        } else {
          throw AuthError.throw_error("UNAUTHORIZED");
        }
      } catch (err: any) {
        if (this.onError) {
          this.onError<T, U>(err, req, res);
        } else {
          throw err;
        }
      }
    };
  }
}

export { NextRoleManager };
export type { INextAutorizeOptions, INextRoleManager, INextRoleManagerOptions };
