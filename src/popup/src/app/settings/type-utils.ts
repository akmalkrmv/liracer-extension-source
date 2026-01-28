type Primitive = string | number | boolean | null | undefined;

type Paths<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? `${Extract<K, string>}`
    : T[K] extends object
      ? `${Extract<K, string>}` | `${Extract<K, string>}.${Paths<T[K]>}`
      : never;
}[keyof T];

type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
