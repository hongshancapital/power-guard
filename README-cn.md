# Power Guard

0 依赖的强类型验证：从 `unknown` 到任何所想。

![CI](https://github.com/gao-sun/power-guard/workflows/CI/badge.svg) ![version](https://badgen.net/npm/v/power-guard) ![size](https://badgen.net/bundlephobia/minzip/power-guard)

### 🤔 验证未知类型变量的惬意方案

与其如此：

```ts
const validate = (x: unknown): SomeType => {
  if (!(typeof x === 'object' && x !== null)) {
    throw new Error('x should be an object');
  }
  if (!('foo' in x && typeof x.foo === 'string')) {
    throw new Error('x.foo should be a string');
  }
  if (!('bar' in x && typeof x.bar === 'boolean')) {
    throw new Error('x.bar should be a boolean');
  }
  // ... a lot of validations
  return x;
};
```

为何不：

```ts
const guarded = guard({
  foo: string.required,
  bar: boolean.required,
  // ... other rules
})(x);
```

### 安装

```bash
yarn add power-guard
# npm
npm i power-guard
```

### 与你最喜爱的框架进行集成

```ts
// Express.js
const { id, name } = guard({ id: number.required, name: string.required })(req.body);

// Koa
const { id, name } = guard({ id: number.required, name: string.required })(ctx.request.body);
```

## 示例

### 原始类型验证

```ts
import { number, string, boolean } from 'power-guard';

number.required(10); // 10
number.strict.required('10'); // 错误：string 在 strict mode 下不被允许
number.gt(10).required('10'); // 错误：值应该大于 10
string.with(10).required('a really long string'); // 错误：string 最大长度为 10
string.optional(undefined); // undefined
boolean.required.array([true, false]); // [true, false]
boolean.required.array(true); // 错误：值应该是 array
boolean.loose.required('1'); // true
```

### 对象验证

```ts
import guard, { number, string, boolean } from 'power-guard';

const guardObject = guard({
  foo: number.required,
  bar: string.optional,
  baz: boolean.required,
});

const { foo, bar, baz } = guardObject({ foo: 10, baz: true }); // 10, undefined, true
const { foo, bar, baz } = guardObject({ foo: '10', baz: 'true' }); // 10, undefined, true
const { foo, bar, baz } = guardObject({ foo: 'abc', baz: 'true' }); // 错误: foo 应该是一个数字
```

### 验证复杂的对象

```ts
import guard, { number, string, enumGuard, boolean, array } from 'power-guard';

enum Foo {
  key1 = 'key1',
  key2 = 2,
}

const guardObject = guard({
  foo: number.gte(10).required,
  bar: string.escaped.optional,
  baz: enumGuard(Foo).optional.array,
  bla: boolean.loose.optional,
  bnd: array(guard({ foo: number.strict.required })),
});

const guarded = guardObject({
  foo: '10',
  bar: '！ａｂｃ　ＡＢＣ！',
  baz: [2, 'key1'],
  bla: 1,
  bnd: [{ foo: 123 }, { foo: 456 }],
});

/*
{
  foo: 10,
  bar: 'abc ABC',
  baz: [2, 'key1'],
  bla: true,
  bnd: [{ foo: 123 }, { foo: 456 }],
}
*/
```

## 文档

### `guard` 函数

这个函数接受一个 `DataConfig` 对象作为参数，并返回接受一个未知变量的守卫函数。当验证成功时，该函数将返回一个基于配置的强类型对象，否则抛出 `PowerGuardError` 异常。

长话短说，这个函数用于验证对象。比如我们想要一个如下结构的对象：

```ts
{ foo: 123, bar: 'abc' }
```

那么我们只需要告诉 `power-guard` ：

```ts
const guardObject = guard({
  foo: number.required,
  bar: string.required,
});
```

或许你已经注意到有多种内置守卫函数，不过同时也允许深度定制：

```ts
const validate = (x: unknown): SomeType => {
  // 你的验证代码
};

const guardObject = guard({
  foo: validate,
});

const { foo } = guardObject(x); // 如果验证成功 foo 的类型将会是 `SomeType`
```

### 内置守卫函数

下文中每个守卫函数需要跟随 `.required` 或 `.optional`，后者将允许 `undefined`。如果需要你可以附加 `.array` 在末尾，例如 `boolean.required.array`。

#### boolean

| Boolean 守卫   | 描述                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| boolean        | boolean 必须出现。`'true'` 和 `'false'` 也能接受。                                                                           |
| boolean.strict | boolean 必须出现。不允许隐式转换。                                                                                           |
| boolean.loose  | boolean 必须出现。`'true'` 和 `'false'` 也能接受。如果值可以被转换成数字，当且仅当数字为 0 时返回 `false`，否则返回 `true`。 |

#### enum

| Enum 守卫           | 描述                      |
| ------------------- | ------------------------- |
| enumGuard(EnumType) | EnumType 中的值必须出现。 |

#### number

| Number 守卫                     | Description                                 |
| ------------------------------- | ------------------------------------------- |
| number                          | number 必须出现。有效的字符串数字也能接受   |
| number.strict                   | number 必须出现。不允许隐式转换。           |
| number.with([lower, upper])     | number 必须出现且在 [lower, upper] 范围内。 |
| number.with(range: NumberRange) | number 必须出现且在 range 范围内。          |
| number.gt(x)                    | number 必须出现且在 (x, +∞) 范围内。        |
| number.gte(x)                   | number 必须出现且在 [x, +∞) 范围内。        |
| number.lt(x)                    | number 必须出现且在 (-∞, x) 范围内。        |
| number.lte(x)                   | number 必须出现且在 (-∞, x] 范围内。        |

```ts
type NumberRange = Partial<{
  lower: number;
  equalsLower: boolean;
  upper: number;
  equalsUpper: boolean;
}>;
```

注意你可以对限制进行链式调用：`number.gt(10).lte(20).strict.required`

#### string

| String 守卫    | 描述                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| string         | string 必须出现。                                                               |
| string.escaped | string 必须出现。标点符号和未知字符将会被移除，且全角字符将会被转换成半角字符。 |
| string.with(x) | string 必须出现且最大长度为 x。                                                 |

注意它们同样可以被链式调用：`string.with(10).escaped.optional`

#### array

有一个帮助函数用于自定义 array 验证并有 optional 选项：

```ts
function array(elemGuard: (x: unknown) => T): (x: unknown) => Array<T>;
function array(elemGuard: (x: unknown) => T, optional: true): (x: unknown) => Array<T> | undefined;
```

#### 传统 Type Guards

`power-guard` 将返回一个你所需要的强类型变量而不是像传统 type guards 一样断言传入变量的类型。 查看 [types.ts](https://github.com/gao-sun/power-guard/blob/master/src/types.ts) 如果你需要进行类型推导。
