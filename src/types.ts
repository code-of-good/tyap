import { Lambda, Epsilon, Z } from "./constants";
import {
  States,
  AlphabetSymbols,
  StackSybmols,
  OutputAlphabet,
} from "./language";

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
  // Выходной символ для преобразователя (ε = пустой выход)
  output: TupleToUnion<typeof OutputAlphabet> | typeof Epsilon;
}

export type TupleToUnion<T extends readonly unknown[]> = T[number];
