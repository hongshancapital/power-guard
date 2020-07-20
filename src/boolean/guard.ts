import throwError from '../error';
import { isBoolean } from '../types';
import { Optional } from '../global';

function guard(x: unknown): boolean;
function guard(x: unknown, optional: true): Optional<boolean>;
function guard(x: unknown, optional = false): Optional<boolean> {
  if (isBoolean(x)) {
    return x;
  }
  if (optional) {
    return undefined;
  }
  return throwError('Error guarding boolean');
}

export default guard;
