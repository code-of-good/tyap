import { Z } from "./constants";

// str rule a^n b^n

export enum States {
  q0 = "q0",
  q1 = "q1",
  qf = "qf",
}

export enum AlphabetSymbols {
  a = "a",
  b = "b",
}

export const StartState = States.q0;
export const StartStackSymbol = Z;
export const EndStates = [States.qf] as const;

export const StackSybmols = [AlphabetSymbols.a, AlphabetSymbols.b, Z] as const;
