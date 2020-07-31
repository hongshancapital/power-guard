import throwError from '../error';
import { isNumber, isBoolean, isString } from '../types';
import { Optional } from '../global';

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
  const parsed =
    (isNumber(x) && x) ||
    (((isBoolean(rangeOrAllowString) && rangeOrAllowString) || allowString) &&
      isString(x) &&
      !isNaN(Number(x)) &&
      Number(x));

  if (parsed !== false) {
    const finalRange =
      (!isBoolean(optionalOrRange) && optionalOrRange) ||
      (!isBoolean(rangeOrAllowString) && rangeOrAllowString);

    if (finalRange) {
      const { lower, equalsLower, upper, equalsUpper } = finalRange;

      if (lower) {
        if ((equalsLower && parsed < lower) || (!equalsLower && parsed <= lower)) {
          throwError(`Value should be greater than${equalsLower ? ' or equals to ' : ' '}${lower}`);
        }
      }

      if (upper) {
        if ((equalsUpper && parsed > upper) || (!equalsUpper && parsed >= upper)) {
          throwError(`Value should be less than${equalsUpper ? ' or equals to ' : ' '}${upper}`);
        }
      }
    }
    return parsed;
  }
  if (isBoolean(optionalOrRange) && optionalOrRange && x === undefined) {
    return x;
  }
  return throwError('Error guarding number');
}

export default guard;
