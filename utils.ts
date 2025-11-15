import { AlphabetSymbols, StackSymbolsType } from "./types";
import { StackSybmolsArray } from "./constants";

export const isStackSymbol = (symbol: AlphabetSymbols): boolean => {
  return StackSybmolsArray.includes(symbol as StackSymbolsType);
};
