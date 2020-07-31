import throwError from '../error';
import { isEnum } from '../types';
import { Optional } from '../global';

function guard<T>(enumObject: T, x: unknown): T[keyof T];
function guard<T>(enumObject: T, x: unknown, optional: true): Optional<T[keyof T]>;
function guard<T>(enumObject: T, x: unknown, optional = false): Optional<T[keyof T]> {
  if (isEnum(enumObject)(x)) {
    return x;
  }
  if (optional && x === undefined) {
    return x;
  }
  return throwError('Error guarding enum');
}

export default guard;
