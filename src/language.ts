// Определение языка L={0^n 1^n | n≥0}

export const Z = "z";

export enum States {
  q0 = "q0",
  q1 = "q1",
  q2 = "q2",
  q3 = "q3",
}

export enum AlphabetSymbols {
  a = "a",
  b = "b",
}

export const StartState = States.q0;
export const StartStackSymbol = Z;
export const EndState = States.q1;

export const StackSybmols = [AlphabetSymbols.a, AlphabetSymbols.b, Z] as const;
