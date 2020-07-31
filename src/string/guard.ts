import throwError from '../error';
import { isString, isBoolean } from '../types';
import { Optional } from '../global';

function guard(x: unknown, maxLength?: number): string;
function guard(x: unknown, optional: true, maxLength?: number): Optional<string>;
function guard(
  x: unknown,
  optionalOrMaxlength?: boolean | number,
  maxLength?: number,
): Optional<string> {
  if (isString(x)) {
    const finalMaxLength = (!isBoolean(optionalOrMaxlength) && optionalOrMaxlength) || maxLength;

    if (finalMaxLength && finalMaxLength > 0 && x.length > finalMaxLength) {
      throwError(`Value shoud have max length ${finalMaxLength}, got ${x.length}`);
    }

    return x;
  }
  if (isBoolean(optionalOrMaxlength) && optionalOrMaxlength && x === undefined) {
    return x;
  }
  return throwError('Error guarding boolean');
}

export default guard;
