import boolean from './boolean';
import enumGuard from './enum';
import throwError from './error';
import { isObject } from './types';
import number from './number';

type DataConfig = {
  [key: string]: GuardFunction<unknown>;
};

type GuardedData<T extends DataConfig> = {
  [key in keyof T]: ReturnType<T[key]>;
};

export const guard = <T extends DataConfig>(config: T): GuardFunction<GuardedData<T>> => (
  data: unknown,
) => {
  if (!isObject(data)) {
    return throwError('Expecting object data');
  }

  const guarded = {} as GuardedData<T>;

  (Object.keys(config) as Array<keyof T>).forEach((key) => {
    // @ts-ignore
    const value = data[key];

    guarded[key] = config[key](value) as ReturnType<T[typeof key]>;
  });

  return guarded;
};

enum Foo {
  Bar = 'Bar',
  Baz = 'Baz',
}

export const tt = guard({
  foo: boolean.required,
  bar: enumGuard(Foo).optional,
  baz: number.optional.array,
})({});
