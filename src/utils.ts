import {
  AlphabetSymbols,
  StackSymbolsType,
  Z,
  StackSybmolsArray,
} from "./language";
import { Epsilon } from "./constants";

export const isStackSymbol = (symbol: AlphabetSymbols): boolean => {
  return StackSybmolsArray.includes(symbol as StackSymbolsType);
};

export const isSymbol = (
  symbol: AlphabetSymbols | typeof Epsilon | typeof Z
): symbol is AlphabetSymbols => {
  return symbol !== Z && symbol !== Epsilon;
};

