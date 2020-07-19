import guard from './guard';

class BooleanGuard implements GuardClass<boolean> {
  get required() {
    return (x: unknown) => guard(x);
  }

  get optional() {
    return (x: unknown) => guard(x, true);
  }
}

export default new BooleanGuard();
