import { Lambda } from "./constants";
import { Z, States, AlphabetSymbols } from "./language";

export enum StackMovement {
  POP = "POP",
  PUSH = "PUSH",
  NONE = "NONE",
  REPLACE = "REPLACE",
}

export type StackSymbolsType =
  | AlphabetSymbols.a
  | AlphabetSymbols.b
  | AlphabetSymbols.c
  | typeof Z;

export interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols | typeof Lambda | typeof Z;
  symbolOnStack: StackSymbolsType;
  endState: States;
  stackMovement: StackMovement;
}

export type TransitionsLine = Transition[];
export type TupleToUnion<T extends readonly unknown[]> = T[number];
