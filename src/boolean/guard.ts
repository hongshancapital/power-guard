import throwError from '../error';
import { isBoolean, isString } from '../types';
import { Optional } from '../global';
import { BooleanMode } from '.';

function guard(x: unknown, mode?: BooleanMode): boolean;
function guard(x: unknown, optional: true, mode?: BooleanMode): Optional<boolean>;
function guard(
  x: unknown,
  optionalOrMode: boolean | BooleanMode = false,
  mode: BooleanMode = 'normal',
): Optional<boolean> {
  const finalMode = (!isBoolean(optionalOrMode) && optionalOrMode) || mode;

  if (isBoolean(x)) {
    return x;
  }

  if (finalMode === 'normal' || finalMode === 'loose') {
    if (isString(x) && ['true', 'false'].includes(x)) {
      return x === 'true';
    }
  }

  if (finalMode === 'loose') {
    const numberX = Number(x);

    if (!isNaN(numberX)) {
      return numberX !== 0;
    }
  }

  if (isBoolean(optionalOrMode) && optionalOrMode && x === undefined) {
    return x;
  }
  return throwError('Error guarding boolean');
}

export default guard;
