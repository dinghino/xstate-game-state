import { InterpreterFrom } from "xstate";
import type { createControlsMachine } from "../Controls";

export type OptionalPropertyOf<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;
/**
 * Returns an object-like type with all the optional properties of the given type
 * requried, with undefined exluded (but not null)
 */
export type Optionals<
  T extends object,
  K extends keyof T = OptionalPropertyOf<T>
> = {
  [key in K]-?: T[key];
};

export type ControlsService = InterpreterFrom<
  ReturnType<typeof createControlsMachine>
>;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
