/**
 * Creates a copy of a provided object, and sets the value of each key with the provided callback function
 */
function isField(value: unknown): boolean {
  return isObject(value) && 'value' in (value as object) && 'permissions' in (value as object);
}

export function objectMap<T>(obj: Record<string, unknown>, callback: (key: unknown, value: unknown) => T): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (isField(obj[key])) {
      newObj[key] = callback(key, obj[key]);
    } else if (isObject(obj[key])) {
      newObj[key] = objectMap(obj[key] as Record<string, unknown>, callback);
    } else {
      newObj[key] = callback(key, obj[key]);
    }
  }
  return newObj;
}

/**
 * Joins to objects together by recursively merging like properties. 
 * New values are stored in a new object, where obj1Key is the key for obj1's value, and obj2Key is the key for obj2's value. 
 * Requires that the objects have the same structure
 */
export function objectJoin<T, K>(obj1: Record<string, unknown>,obj1Name: string, obj2: Record<string, unknown>, obj2Name: string): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const key of Object.keys(obj1)) {
    if (isObject(obj1[key])) newObj[key] = objectJoin(obj1[key] as Record<string, unknown>, obj1Name, obj2[key] as Record<string, unknown>, obj2Name);
    else newObj[key] = { [obj1Name]: obj1[key], [obj2Name]: obj2[key] }
  }
  return newObj;
}

export function isObject(value: unknown): value is Object {
  return (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
  );
}
