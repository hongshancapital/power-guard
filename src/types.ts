// https://stackoverflow.com/questions/59480160/typescript-check-object-by-type-or-interface-at-runtime-with-typeguards-in-2020
const primitiveGuard = <T>(typeOf: string) => (x: unknown): x is T => typeof x === typeOf;

export const isString = primitiveGuard<string>('string');

export const isNumber = primitiveGuard<number>('number');

export const isBoolean = primitiveGuard<boolean>('boolean');

export const isNull = (x: unknown): x is null => x === null;

export const isObject = (x: unknown): x is object => !isNull(x) && typeof x === 'object';

export const isEnum = <T>(enumObject: T) => (token: unknown): token is T[keyof T] =>
  Object.values(enumObject).includes(token as T[keyof T]);

export const isArray = <T>(elemGuard: Guard<T>) => (x: unknown): x is Array<T> =>
  Array.isArray(x) && x.every((el) => elemGuard(el));
