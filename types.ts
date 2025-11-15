import { Epsilon, Z } from "./constants";

export enum States {
  q0 = "q0",
  q1 = "q1",
}

export enum AlphabetSymbols {
  zero = "0",
  one = "1",
}

export enum StackMovement {
  POP = "POP",
  PUSH = "PUSH",
  NONE = "NONE",
  REPLACE = "REPLACE",
}

export type StackSymbolsType = AlphabetSymbols.zero | "z";

export interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols | typeof Epsilon | typeof Z;
  symbolOnStack: StackSymbolsType;
  endState: States;
  stackMovement: StackMovement;
}

export type TransitionsLine = Transition[];
