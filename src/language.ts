// Определение языка L={0^n 1^n | n≥0}

import { Z } from "./constants";

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
export const EndState = States.qf;

export const StackSybmols = [AlphabetSymbols.a, AlphabetSymbols.b, Z] as const;
