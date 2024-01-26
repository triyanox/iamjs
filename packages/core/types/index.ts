import { Role } from '../lib';
import { ConcatStrings, IntersectionToUnion, MergeObjects } from './utils.types';

/**
 * Base actions
 */
type DefaultScope = 'c' | 'r' | 'u' | 'd' | 'l';
/**
 * Permission type
 */
type permission = 'create' | 'read' | 'update' | 'delete' | 'list';
/**
 * Permissions type
 */
type permissions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | ('create' | 'read' | 'update' | 'delete' | 'list')[];
/**
 * The base permissions used in the `IPermision` interface
 */
type BasePermissions = ConcatStrings<
  'c' | '-',
  ConcatStrings<'r' | '-', ConcatStrings<'u' | '-', ConcatStrings<'d' | '-', 'l' | '-'>>>
>;

type InferResources<T extends Record<string, IPermission>> = {
  [K in keyof T]: K;
}[keyof T];
type InferPermissions<T extends Record<string, IPermission>> = {
  [K in keyof T]: {
    [P in permission]: boolean;
  } & {
    [P in keyof T[K]['custom']]: boolean;
  };
};

/**
 * Permission interface
 */
interface IPermission {
  /**
   * The base permissions as a string of **c**reate, **r**ead, **u**pdate, **d**elete, **l**ist
   * @example "crudl" or "-----" or "cru--"
   */
  base: BasePermissions;
  /**
   * The custom permissions
   * Can be used to override the base permissions too
   * @example { "publish": true, "unpublish": false }
   */
  custom?: Record<string, boolean>;
}
/**
 * Role options type
 */
type TRoleOptions = {
  /**
   * The name of the role
   */
  name: string;
  /**
   * The description of the role
   */
  description?: string;
  /**
   * Additional meta data
   */
  meta?: Record<string, any>;
  /**
   * Role config
   */
  config: Record<string, IPermission>;
};
/**
 * Role interface
 */
interface IRole<T extends TRoleOptions> {
  /**
   * The name of the role
   */
  name: T['name'];

  /**
   * The description of the role
   */
  description?: string;

  /**
   * Additional meta data
   */
  meta?: Record<string, any>;

  /**
   * Role config
   */
  config: T['config'];

  /**
   * Role resources
   */
  resources: InferResources<T['config']>[];

  /**
   * Role permissions
   */
  permissions: InferPermissions<T['config']>;

  /**
   * Get all the resources
   */
  getResources(): InferResources<T['config']>[];

  /**
   * Get all the permissions
   */
  getPermissions(): InferPermissions<T['config']>;

  /**
   * Creates a new instance of the role with the given permissions.
   * @note By default this does not mutate the current role
   * @note By default this overrides the existing permissions
   */
  add<S extends string, P extends IPermission>(options: addOptions<S, P>): RoleAddResult<T, S, P>;

  /**
   * Removes a specific resource from the role.
   * @note By default this does not mutate the current role
   */
  remove<S extends string>(options: removeOptions<S>): RoleRemoveResult<T, S>;

  /**
   * Updates permissions for a specific resource.
   * @note By default this method does not mutate the current role
   * @note By default this method overrides the existing permissions
   */
  update<S extends keyof Record<string, IPermission>, P extends IPermission>(
    options: updateOptions<S, P>
  ): RoleUpdateResult<T, S, P>;

  /**
   * Checks if the role has the given permission for the given resource.
   */
  can<
    S extends keyof InferPermissions<T['config']>,
    P extends keyof InferPermissions<T['config']>[S]
  >(
    resource: S,
    permission: P
  ): boolean;

  /**
   * Checks if the role does not have the given permission for the given resource.
   */
  cannot<
    S extends keyof InferPermissions<T['config']>,
    P extends keyof InferPermissions<T['config']>[S]
  >(
    resource: S,
    permission: P
  ): boolean;

  /**
   * Checks if the role has any of the given permissions for the given resource.
   */
  canAny<S extends keyof this['permissions']>(
    resource: S,
    permissions: (keyof this['permissions'][S])[]
  ): boolean;

  /**
   * Checks if the role has all of the given permissions for the given resource.
   */
  canAll<S extends keyof this['permissions']>(
    resource: S,
    permissions: (keyof this['permissions'][S])[]
  ): boolean;

  /**
   * Clones the role instance
   */
  clone(): Role<T>;

  /**
   * Returns the role as JSON string
   */
  toJSON(): ToJSONResult;

  /**
   * Returns the role as POJO (Plain Old JavaScript Object)
   */
  toObject(): ToObjectResult<T>;
}

type RoleAddResult<T extends TRoleOptions, S extends string, P extends IPermission> = Role<{
  name: T['name'];
  description: string | undefined;
  meta: Record<string, any> | undefined;
  config: MergeObjects<T['config'], { [K in S]: P }>;
}>;

type RoleUpdateResult<
  T extends TRoleOptions,
  S extends keyof Record<string, IPermission>,
  P extends IPermission
> = Role<{
  name: T['name'];
  description: string | undefined;
  meta: Record<string, any> | undefined;
  config: MergeObjects<T['config'], { [K in S]: P }>;
}>;

type RoleRemoveResult<T extends TRoleOptions, S extends keyof Record<string, IPermission>> = Role<{
  name: T['name'];
  description: string | undefined;
  meta: Record<string, any> | undefined;
  config: Omit<T['config'], S>;
}>;

type ToObjectResult<T extends TRoleOptions> = {
  name: T['name'];
  description: string | undefined;
  meta: Record<string, any> | undefined;
  config: T['config'];
  permissions: InferPermissions<T['config']>;
  resources: InferResources<T['config']>[];
};

type ToJSONResult = string;

/**
 * The options for the `add` method
 */
type addOptions<T extends string, P extends IPermission> = {
  /**
   * The resource to add
   */
  resource: T;
  /**
   * The resource permissions
   */
  permissions: P;
  /**
   * Whether to mutate the current role or not
   * @default false
   */
  mutate?: boolean;
  /**
   * Whether to override the existing permissions or not
   */
  noOverride?: boolean;
};

/**
 * The options for the `remove` method
 */
type removeOptions<T extends string> = {
  /**
   * The resource to remove
   */
  resource: T;
  /**
   * Whether to mutate the current role or not
   * @default false
   */
  mutate?: boolean;
};

/**
 * The options for the `update` method
 */
type updateOptions<T extends keyof Record<string, IPermission>, P> = {
  /**
   * The resource to update
   */
  resource: T;
  /**
   * The resource permissions
   */
  permissions: P;
  /**
   * Whether to mutate the current role or not
   * @default false
   */
  mutate?: boolean;
  /**
   * Whether to override the existing permissions or not
   */
  noOverride?: boolean;
};

type Roles<T> = {
  [K in keyof T]: T[K] extends Role<infer U extends TRoleOptions> ? Role<U> : never;
};

type AllKeys<
  T extends {
    [K in keyof T]: T[K] extends Role<infer U> ? Role<U> : never;
  }
> = {
  [K in keyof T]: keyof T[K]['permissions'];
}[keyof T];

type MergePermissions<
  T extends {
    [K in keyof T]: T[K] extends Role<infer U> ? Role<U> : never;
  }
> = {
  [K in AllKeys<T>]: {
    [Role in keyof T]: K extends keyof T[Role]['permissions'] ? T[Role]['permissions'][K] : never;
  }[keyof T];
};

type Resources<T extends Roles<T>> =
  | Array<keyof MergePermissions<T>>
  | keyof MergePermissions<T>
  | (string & {})
  | (string & {})[];

type Actions<T extends Roles<T>> =
  | Array<keyof IntersectionToUnion<MergePermissions<T>[keyof MergePermissions<T>]>>
  | keyof IntersectionToUnion<MergePermissions<T>[keyof MergePermissions<T>]>
  | (string & {})
  | (string & {})[];

interface ISchema<T extends Roles<T>> {
  roles: {
    [K in keyof T]: T[K] extends Role<infer U> ? Role<U> : never;
  };
  /**
   * Returns the role with the given name
   * @param name
   */
  getRole<K extends keyof T>(name: K): T[K];
  /**
   * Returns all resources in the schema
   */
  getResources(): Record<keyof MergePermissions<T>, keyof MergePermissions<T>>;
  /**
   * Get all resources in the schema
   */
  toJSON<K extends keyof T>(role: K): string;
  toJSON<K extends keyof T, R>(role: K, transform: (data: string) => R): R;
  toJSON<K extends keyof T, R>(role: K, transform?: (data: string) => R): string | R;

  /**
   * Convert a role into an object, optionally transform the result
   */
  toObject<K extends keyof T>(role: K): GetRoleConfig<T[K]>;
  toObject<K extends keyof T, R>(role: K, transform: (data: GetRoleConfig<T[K]>) => R): R;
  toObject<K extends keyof T, R>(
    role: K,
    transform?: (data: GetRoleConfig<T[K]>) => R
  ): GetRoleConfig<T[K]> | R;
  /**
   * Check if a role exists in the schema
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  exists(role: keyof T | (string & {})): boolean;
}

/**
 * The options for the `Schema` class
 */
type TSchemaOptions<T extends Roles<T>> = {
  /**
   * The roles to add to the schema
   */
  roles: T;
};

type TransformedRole<U extends TRoleOptions> = (role: Role<U>) => Role<U>;

interface IAuthManager<T extends Roles<T>> {
  /**
   * `AuthManager` schema
   */
  schema: ISchema<T>;
  /**
   * This method is used to check the permissions of a role on a resource
   */
  authorize(options: TAutorizeOptions<T>): boolean;
}

type AuthorizeRoleOptions<T extends Roles<T>> = {
  /**
   * The role to authorize
   */
  role: keyof T;
  /**
   * The resources to authorize
   */
  resources: Resources<T>;
  /**
   * The actions to authorize
   */
  actions: Actions<T>;

  /**
   * The strict mode
   */
  strict?: boolean;
};

type AuthorizeConstructOptions<T extends Roles<T>> = {
  /**
   * The resources to authorize
   */
  resources: Resources<T>;
  /**
   * The actions to authorize
   */
  actions: Actions<T>;
  /**
   * The strict mode
   */
  strict?: boolean;
  /**
   * Whether to construct the role from an `object` or generated `json` string
   */
  construct: boolean;
  /**
   * The role object or json string
   */
  data: string | object;
};

/**
 * The options for the `authorize` method
 * You can either pass a `role` or construct a role from an `object` or `json` string
 */
type TAutorizeOptions<T extends Roles<T>> = AuthorizeRoleOptions<T> | AuthorizeConstructOptions<T>;

type TAuthResources<U extends TRoleOptions> = keyof Role<U>['permissions'];
type TAuthPermissions<U extends TRoleOptions> = keyof IntersectionToUnion<
  Role<U>['permissions'][TAuthResources<U>]
>;

type AuthErrorCodes =
  | 'ERR_INVALID_ROLE'
  | 'ERR_INVALID_RESOURCE'
  | 'ERR_INVALID_ACTION'
  | 'UNKNOWN_ERROR'
  | 'UNAUTHORIZED';

type GetRoleConfig<T extends TRoleOptions> = ToObjectResult<{
  name: T['name'];
  description: T['description'];
  config: T['config'];
  meta: T['meta'];
}>;

export type {
  AllKeys,
  AuthErrorCodes,
  AuthorizeConstructOptions,
  AuthorizeRoleOptions,
  DefaultScope,
  IAuthManager,
  IPermission,
  IRole,
  ISchema,
  InferPermissions,
  InferResources,
  IntersectionToUnion,
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
  BasePermissions,
  updateOptions,
  Resources,
  Actions,
  TSchemaOptions,
  TransformedRole,
  GetRoleConfig
};
