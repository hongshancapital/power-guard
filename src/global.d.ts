type Optional<T> = T | undefined;

type Guard<T> = (x: unknown) => x is T;

interface GuardFunction<T> {
  (x: unknown): T;
}

interface GuardClass<T> {
  optional: (x: unknown) => Optional<T>;
  required: (x: unknown) => T;
}
