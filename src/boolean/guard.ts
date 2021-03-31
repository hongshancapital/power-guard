import { isBoolean, isString } from '../types';
import { Nullable } from '../global';
import { BooleanMode } from '.';
import PowerGuardError from '../error';

function guard(x: unknown, mode?: BooleanMode): boolean;
function guard(x: unknown, optional: true, mode?: BooleanMode): Nullable<boolean>;
function guard(
  x: unknown,
  optionalOrMode: boolean | BooleanMode = false,
  mode: BooleanMode = 'normal',
): Nullable<boolean> {
  const optional = isBoolean(optionalOrMode) && optionalOrMode;
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

  if (optional && (x === undefined || x === null)) {
    return x;
  }
  throw new PowerGuardError('boolean', x, optional);
}

export default guard;
