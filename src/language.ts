// Определение языка L={0^n 1^n | n≥0}

export const Z = "z";

export enum States {
  q0 = "q0",
  q1 = "q1",
}

export enum AlphabetSymbols {
  zero = "0",
  one = "1",
}

export type StackSymbolsType = AlphabetSymbols.zero | typeof Z;

export const StartState = States.q0;
export const StartStackSymbol = Z;
export const EndState = States.q0;

export const StackSybmolsArray: StackSymbolsType[] = [AlphabetSymbols.zero, Z];

