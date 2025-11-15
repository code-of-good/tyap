import { AlphabetSymbols, States, StackSymbolsType } from "./types";

export const Z = "z";

export const StartState = States.q0;
export const StartStackSymbol = Z;
export const EndState = States.q0;

export const StackSybmolsArray: StackSymbolsType[] = [AlphabetSymbols.zero, Z];
