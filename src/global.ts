export type Nullable<T> = T | undefined | null;

export type Guard<T> = (x: unknown) => x is T;

export interface GuardFunction<T> {
  (x: unknown): T;
}

export interface GuardFunctionWithArray<T> extends GuardFunction<T> {
  array: GuardFunction<Array<T>>;
  arrayNotEmpty: GuardFunction<Array<T>>;
}

export interface OptionalGuardFunctionWithArray<T> extends GuardFunction<Nullable<T>> {
  array: GuardFunction<Nullable<Array<T>>>;
}

export interface GuardClass<T> {
  optional: OptionalGuardFunctionWithArray<T>;
  required: GuardFunctionWithArray<T>;
}
