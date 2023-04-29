/**
 * Concat type
 */
type Concat<T extends string, U extends string> = `${T}${U}`;

/**
 * Permissions Object type
 */
type PermissionsObject = Record<string, Record<permission, boolean>>;

/**
 * Scopes type
 */
type scopes = Concat<'c' | '-', Concat<'r' | '-', Concat<'u' | '-', Concat<'d' | '-', 'l' | '-'>>>>;

/**
 * Permission interface
 */
interface IPermission {
  resource: string;
  scopes: scopes;
}

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

type extendOpts = { overwrite?: boolean; permissions?: IPermission[] } | IPermission[];

/**
 * Role interface
 */
interface IRole {
  /**
   * permissions
   */
  permissions: IPermission[];
  /**
   * Add permission
   * @param permission - Permission to add
   */
  addPermission(permission: IPermission): this;
  /**
   * Remove permission
   * @param resource - Resource to remove
   */
  removePermission(resource: string): this;
  /**
   * Update permission
   * @param permission - Permission to update
   */
  updatePermission(permission: IPermission): this;
  /**
   * Check if the user with this role can create a resource
   * @param resource - Resource to check
   */
  canCreate(resource: string): boolean;
  /**
   * Check if user with this role can read a resource
   * @param resource - Resource to check
   */
  canRead(resource: string): boolean;
  /**
   * Check if user with this role can update a resource
   * @param resource - Resource to check
   */
  canUpdate(resource: string): boolean;
  /**
   * Check if user with this role can delete a resource
   * @param resource - Resource to check
   */
  canDelete(resource: string): boolean;
  /**
   * Check if user with this role can list a resource
   * @param resource - Resource to check
   */
  canList(resource: string): boolean;
  /**
   * Check if user can perform a permission on a resource
   */
  can(permission: permission, resource: string): boolean;
  /**
   * Check if user can perform any of the permissions on a resource
   * @param permissions - Permissions to check
   * @param resource - Resource to check
   */
  canAny(permissions: permissions, resource: string): boolean;
  /**
   * Check if user can perform all of the permissions on a resource
   * @param permissions - Permissions to check
   * @param resource - Resource to check
   */
  canAll(permissions: permissions, resource: string): boolean;
  /**
   * Generates a a javascript object or json string of the role with all the permissions
   * @param format - Format to return the role in ( json or object )
   */
  generate(format: 'json' | 'object'): PermissionsObject | string;
  /**
   * Extends the role with another role
   */
  extend(role: IRole, options?: extendOpts): this;
  /**
   * toJSON method to generate a json string of the role
   */
  toJSON(): string;
  /**
   * `toObject` method to generate a javascript object of the role
   */
  toObject(): PermissionsObject;
  /**
   * Get all resources that the role has access to
   */
  getResources(): string[];
}

/**
 * The interface for the `authorize` function
 */
interface IAutorizeOptions {
  /**
   * The role key
   */
  role?: string;
  /**
   * The action or actions to be performed
   */
  action?: permission | permission[];
  /**
   * The resource or resources that are authorized to be accessed
   */
  resource: string | string[];
  /**
   * Construct the role from permissions
   */
  constructRole?: boolean;
  /**
   * The permissions to be used to construct the role an Object with all the permissions of the role
   */
  permissions?: PermissionsObject;
  /**
   * If the permissions should be checked in a loose way
   * @default false
   */
  loose?: boolean;
}

interface IAuthManagerOptions {
  /**
   * The roles that are available to the `ExpressRoleManager` instance
   */
  roles: { [key: string]: IRole };
  /**
   * The resources that are available to the `ExpressRoleManager` instance
   */
  resources: string[];
}

interface IAuthManager {
  /**
   * The roles that are available to the `ExpressRoleManager` instance
   */
  roles: Map<string, IRole>;
  /**
   * The resources that are available to the `ExpressRoleManager` instance
   */
  resources: Set<string>;
  /**
   * The function that is used to authorize a role
   */
  authorizeRole: (options: IAutorizeOptions) => boolean;
}

type ErrorCodes =
  | 'INVALID_ROLE'
  | 'INVALID_RESOURCE'
  | 'INVALID_PERMISSION'
  | 'INVALID_PERMISSIONS'
  | 'NO_PERMISSIONS'
  | 'MISSING_RESOURCE'
  | 'MISSING_ACTION'
  | 'UNAUTHORIZED';

export {
  IPermission,
  IRole,
  IAuthManager,
  IAuthManagerOptions,
  IAutorizeOptions,
  permission,
  permissions,
  scopes,
  extendOpts,
  ErrorCodes,
  PermissionsObject
};
