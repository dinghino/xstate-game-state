
import { AnyInterpreter } from 'xstate'

// export type TClosureParameters<F> = F extends (service: any, ...args: infer P) => any ? P : never

export type TActionFunction<S extends AnyInterpreter, F> =
  F extends (service: S, ...args: infer P) => infer R ? (service: S,...args: P) => R : never;

/** Generic TActionFunctino for when we don't need to know the extra arguments */
export type TAnyAction = TActionFunction<AnyInterpreter, (service: AnyInterpreter, ...args: any) => any>;

export type TActionClosure<F> =
  F extends (service: any, ...args: infer P) => infer R ? (...args: P) => R : never;
