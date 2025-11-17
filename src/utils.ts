import { AlphabetSymbols, Z, StackSybmols } from "./language";
import { Lambda } from "./constants";
import { TupleToUnion } from "./types";

export const isStackSymbol = (symbol: AlphabetSymbols): boolean => {
  return StackSybmols.includes(symbol as TupleToUnion<typeof StackSybmols>);
};

export const isSymbol = (
  symbol: AlphabetSymbols | typeof Lambda | typeof Z
): symbol is AlphabetSymbols => {
  return symbol !== Z && symbol !== Lambda;
};
