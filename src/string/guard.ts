import { isString, isBoolean } from '../types';
import { Nullable } from '../global';
import PowerGuardError from '../error';

function guard(x: unknown, maxLength?: number): string;
function guard(x: unknown, optional: true, maxLength?: number): Nullable<string>;
function guard(
  x: unknown,
  optionalOrMaxlength?: boolean | number,
  maxLength?: number,
): Nullable<string> {
  const optional = isBoolean(optionalOrMaxlength) && optionalOrMaxlength;

  if (isString(x)) {
    const finalMaxLength = (!isBoolean(optionalOrMaxlength) && optionalOrMaxlength) || maxLength;

    if (finalMaxLength && finalMaxLength > 0 && x.length > finalMaxLength) {
      throw new PowerGuardError(
        'string',
        x,
        optional,
        `Value shoud have max length ${finalMaxLength}, got ${x.length}`,
      );
    }

    return x;
  }

  if (optional && (x === undefined || x === null)) {
    return x;
  }

  throw new PowerGuardError('string', x, optional);
}

export default guard;
