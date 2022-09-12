
import { AnyInterpreter } from 'xstate'

// export type TClosureParameters<F> = F extends (service: any, ...args: infer P) => any ? P : never

export type TActionFunction<F> =
  F extends (service: AnyInterpreter, ...args: infer P) => infer R ? (service: AnyInterpreter,...args: P) => R : never;

/** Generic TActionFunctino for when we don't need to know the extra arguments */
export type TAnyAction = TActionFunction<(service: AnyInterpreter, ...args: any) => any>;

export type TActionClosure<F> =
  F extends (service: AnyInterpreter, ...args: infer P) => infer R ? (...args: P) => R : never;
