export type Optional<T> = T | undefined;

export type Guard<T> = (x: unknown) => x is T;

export interface GuardFunction<T> {
  (x: unknown): T;
}

export interface GuardFunctionWithArray<T> extends GuardFunction<T> {
  array: GuardFunction<Array<T>>;
}

export interface OptionalGuardFunctionWithArray<T> extends GuardFunction<Optional<T>> {
  array: GuardFunction<Optional<Array<T>>>;
}

export interface GuardClass<T> {
  optional: OptionalGuardFunctionWithArray<T>;
  required: GuardFunctionWithArray<T>;
}
