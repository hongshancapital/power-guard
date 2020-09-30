import { isNumber, isBoolean, isString } from '../types';
import { Optional } from '../global';
import PowerGuardError from '../error';

type Range = {
  lower: number;
  equalsLower: boolean;
  upper: number;
  equalsUpper: boolean;
};

export type NumberRange = Partial<Range>;

function guard(x: unknown, range?: NumberRange, allowString?: boolean): number;
function guard(
  x: unknown,
  optional: true,
  range?: NumberRange,
  allowString?: boolean,
): Optional<number>;
function guard(
  x: unknown,
  optionalOrRange?: boolean | NumberRange,
  rangeOrAllowString?: NumberRange | boolean,
  allowString = false,
): Optional<number> {
  const optional = isBoolean(optionalOrRange) && optionalOrRange;
  const parsed = isNumber(x)
    ? x
    : ((isBoolean(rangeOrAllowString) && rangeOrAllowString) || allowString) &&
      isString(x) &&
      !isNaN(Number(x)) &&
      Number(x);

  if (parsed !== false) {
    const finalRange =
      (!isBoolean(optionalOrRange) && optionalOrRange) ||
      (!isBoolean(rangeOrAllowString) && rangeOrAllowString);

    if (finalRange) {
      const { lower, equalsLower, upper, equalsUpper } = finalRange;

      if (lower !== undefined) {
        if ((equalsLower && parsed < lower) || (!equalsLower && parsed <= lower)) {
          throw new PowerGuardError(
            'number',
            x,
            optional,
            `Value should be greater than${equalsLower ? ' or equals to ' : ' '}${lower}`,
          );
        }
      }

      if (upper !== undefined) {
        if ((equalsUpper && parsed > upper) || (!equalsUpper && parsed >= upper)) {
          throw new PowerGuardError(
            'number',
            x,
            optional,
            `Value should be less than${equalsUpper ? ' or equals to ' : ' '}${upper}`,
          );
        }
      }
    }
    return parsed;
  }
  if (optional && x === undefined) {
    return x;
  }
  throw new PowerGuardError('number', x, optional);
}

export default guard;
