import { isObject } from './types';
import { GuardFunction } from './global';
import PowerGuardError, { PowerGuardKeyError } from './error';

export type DataConfig = {
  [key: string]: GuardFunction<unknown>;
};

export type GuardedData<T extends DataConfig> = {
  [key in keyof T]: ReturnType<T[key]>;
};

export const guard = <T extends DataConfig>(config: T): GuardFunction<GuardedData<T>> => (
  data: unknown,
) => {
  if (!isObject(data)) {
    throw new PowerGuardError('object', data, false);
  }

  const guarded = {} as GuardedData<T>;

  (Object.keys(config) as Array<keyof T>).forEach((key) => {
    // @ts-ignore
    const value = data[key];

    try {
      guarded[key] = config[key](value) as ReturnType<T[typeof key]>;
    } catch (error) {
      if (error instanceof PowerGuardError) {
        throw new PowerGuardKeyError(String(key), error);
      }
      throw error;
    }
  });

  return guarded;
};

export * from './global';

export * from './types';

export { default as PowerGuardError, PowerGuardKeyError } from './error';

export { default as array } from './array';

export { default as boolean } from './boolean';

export { default as enumGuard } from './enum';

export { default as number } from './number';

export { default as string } from './string';
