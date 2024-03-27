import { isString, isBoolean } from '../types.js';
import { Optional } from '../global.js';
import PowerGuardError from '../error.js';

function guard(x: unknown, maxLength?: number): string;
function guard(x: unknown, optional: true, maxLength?: number): Optional<string>;
function guard(
  x: unknown,
  optionalOrMaxlength?: boolean | number,
  maxLength?: number,
): Optional<string> {
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

  if (optional && x === undefined) {
    return x;
  }

  throw new PowerGuardError('string', x, optional);
}

export default guard;
