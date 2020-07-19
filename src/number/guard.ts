import throwError from '../error';
import { isNumber, isBoolean } from '../types';

type Range = {
  lower: number;
  equalsLower: boolean;
  upper: number;
  equalsUpper: boolean;
};

export type NumberRange = Partial<Range>;

function guard(x: unknown, range?: NumberRange): number;
function guard(x: unknown, optional: true, range?: NumberRange): Optional<number>;
function guard(
  x: unknown,
  optionalOrRange?: boolean | NumberRange,
  range?: NumberRange,
): Optional<number> {
  if (isNumber(x)) {
    const finalRange = (!isBoolean(optionalOrRange) && optionalOrRange) || range;

    if (finalRange) {
      const { lower, equalsLower, upper, equalsUpper } = finalRange;

      if (lower) {
        if ((equalsLower && x < lower) || (!equalsLower && x <= lower)) {
          throwError(`Value should be greater than${equalsLower ? ' or equals to ' : ' '}${lower}`);
        }
      }

      if (upper) {
        if ((equalsUpper && x > upper) || (!equalsUpper && x >= upper)) {
          throwError(`Value should be less than${equalsUpper ? ' or equals to ' : ' '}${upper}`);
        }
      }
    }
    return x;
  }
  if (isBoolean(optionalOrRange) && optionalOrRange) {
    return undefined;
  }
  return throwError('Error guarding number');
}

export default guard;
