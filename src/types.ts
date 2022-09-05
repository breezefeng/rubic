export type Method = (...args: any[]) => any

export type Data = Record<string, unknown>

export type AnyObject = Record<string, any>

export type Bindings = Record<string, any>

export type LooseRequired<T> = { [P in string & keyof T]: T[P] }

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

export type Flat<T> = T extends Method ? T : T extends object ? { [K in keyof T]: T[K] } : T

export type FlatDeep<T> = T extends Method ? T : T extends object ? { [K in keyof T]: FlatDeep<T[K]> } : T

export type ObjectKeyPaths<T extends object> = T extends Record<string, any>
  ? {
      [P in keyof T]: T[P] extends Record<string, any>
        ? P extends string
          ? `${P}.${ObjectKeyPaths<T[P]>}` | P
          : never
        : P
    }[keyof T]
  : never
