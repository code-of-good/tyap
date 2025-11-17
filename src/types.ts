import { Epsilon } from "./constants";
import { Z, States, AlphabetSymbols } from "./language";

export enum StackMovement {
  POP = "POP",
  PUSH = "PUSH",
  NONE = "NONE",
  REPLACE = "REPLACE",
}

export type StackSymbolsType = AlphabetSymbols.zero | typeof Z;

export interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols | typeof Epsilon | typeof Z;
  symbolOnStack: StackSymbolsType;
  endState: States;
  stackMovement: StackMovement;
}

export type TransitionsLine = Transition[];

