/**
 * Type-safe Object.keys that preserves the actual keys of the object type instead of returning string[]
 * @param obj The object to get the keys from
 */
export function keysFromObject<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Type-safe Object.values that infers the correct value types
 * @param obj The object to get the values from
 */
export function valuesFromObject<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

/**
 * Type-safe Object.entries that preserves both key and value types
 * @param obj The object to get the entries from
 */
export function entriesFromObject<T extends object>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
