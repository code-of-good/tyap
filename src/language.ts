import { Z } from "./constants";

// str rule ab^n c^n+1 a^2k

export enum States {
  q0 = "q0",
  q1 = "q1",
  q2 = "q2",
  q3 = "q3",
  q4 = "q4",
  qf = "qf",
}

// Входной алфавит
export enum AlphabetSymbols {
  a = "a",
  b = "b",
  c = "c",
}

// Выходной алфавит (можно настроить под свои нужды)
export enum OutputSymbols {
  x = "x",
  y = "y",
  w = "w",
}

export const StartState = States.q0;
export const StartStackSymbol = Z;
export const EndStates = [States.qf] as const;

export const StackSybmols = [AlphabetSymbols.a, AlphabetSymbols.b, Z] as const;
export const OutputAlphabet = [OutputSymbols.x, OutputSymbols.y, OutputSymbols.w] as const;
