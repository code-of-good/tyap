import { Lambda } from "./constants";
import { Z, States, AlphabetSymbols, StackSybmols } from "./language";

export enum StackMovement {
  POP = "POP",
  PUSH = "PUSH",
  NONE = "NONE",
  REPLACE = "REPLACE",
}

export interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols | typeof Lambda | typeof Z;
  symbolOnStack: TupleToUnion<typeof StackSybmols>;
  endState: States;
  stackMovement: StackMovement;
}

export type TupleToUnion<T extends readonly unknown[]> = T[number];
