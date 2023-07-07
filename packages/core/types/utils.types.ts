type ConcatStrings<T extends string, U extends string> = `${T}${U}`;
type Equals<T extends string, U extends string> = T extends U ? true : false;
type NotEquals<T extends string, U extends string> = T extends U ? false : true;
type MergeObjects<T extends Record<string, any>, U extends Record<string, any>> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K];
} & U;
type InferCustomPermissions<T extends Record<string, boolean>> = {
  [K in keyof T]: T[K] extends true ? K : never;
}[keyof T];

type MergeArrays<T extends any[], U extends any[]> = [...T, ...U];
type IntersectionToUnion<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never;

export {
  ConcatStrings,
  Equals,
  InferCustomPermissions,
  IntersectionToUnion,
  MergeArrays,
  MergeObjects,
  NotEquals
};
