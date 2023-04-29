import {
  ErrorCodes,
  IAuthManager,
  IAuthManagerOptions,
  IAutorizeOptions,
  IPermission,
  IRole,
  extendOpts,
  permission,
  permissions,
  scopes,
  PermissionsObject
} from '../types';
import AuthError from './AuthError';
import Role from './Role';
import AuthManager from './AuthManager';

export { AuthError, AuthManager, Role };
export type {
  ErrorCodes,
  IAuthManager,
  IAuthManagerOptions,
  IAutorizeOptions,
  IPermission,
  IRole,
  extendOpts,
  permission,
  permissions,
  scopes,
  PermissionsObject
};
