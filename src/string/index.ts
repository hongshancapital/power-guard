import guard from './guard';

class StringGuard implements GuardClass<string> {
  private maxLength?: number;

  get required() {
    return (x: unknown) => guard(x, this.maxLength);
  }

  get optional() {
    return (x: unknown) => guard(x, true, this.maxLength);
  }

  with(maxLength: number): StringGuard {
    return new StringGuard(maxLength);
  }

  constructor(maxLength?: number) {
    this.maxLength = maxLength;
  }
}

export default new StringGuard();
