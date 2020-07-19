type Optional<T> = T | undefined;

type Guard<T> = (x: unknown) => x is T;

interface GuardFunction<T> {
  (x: unknown): T;
}

interface GuardFunctionWithArray<T> extends GuardFunction<T> {
  array: GuardFunction<Array<T>>;
}

interface OptionalGuardFunctionWithArray<T> extends GuardFunction<Optional<T>> {
  array: GuardFunction<Optional<Array<T>>>;
}

interface GuardClass<T> {
  optional: OptionalGuardFunctionWithArray<T>;
  required: GuardFunctionWithArray<T>;
}
