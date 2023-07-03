import Role from './role';
import AuthManager from './auth';
import Schema from './schema';
import AuthError from './error';

export { Role, AuthManager, Schema, AuthError };
export type {
  AllKeys,
  AuthorizeConstructOptions,
  AuthorizeRoleOptions,
  DefaultScope,
  IAuthManager,
  IPermission,
  IRole,
  ISchema,
  InferPermissions,
  InferResources,
  MergePermissions,
  RoleAddResult,
  RoleRemoveResult,
  RoleUpdateResult,
  Roles,
  TAuthPermissions,
  TAuthResources,
  TAutorizeOptions,
  TRoleOptions,
  ToJSONResult,
  ToObjectResult,
  addOptions,
  permission,
  permissions,
  removeOptions,
  scopes,
  updateOptions,
  IntersectionToUnion,
  AuthErrorCodes,
  Resources,
  Actions
} from '../types';
