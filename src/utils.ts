import { AlphabetSymbols, StackSybmols } from "./language";
import { Lambda, Z } from "./constants";
import { TupleToUnion } from "./types";

export const isStackSymbol = (symbol: AlphabetSymbols): boolean => {
  return StackSybmols.includes(symbol as TupleToUnion<typeof StackSybmols>);
};

export const isSymbol = (
  symbol: AlphabetSymbols | typeof Lambda | typeof Z
): symbol is AlphabetSymbols => {
  return symbol !== Z && symbol !== Lambda;
};
