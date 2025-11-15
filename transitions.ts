import {
  StackSymbols,
  AlphabetSymbols,
  States,
  Transition,
  StackMovement,
  TransitionsLine,
} from "./types";

export const textLine: AlphabetSymbols[] = [
  AlphabetSymbols.zero,
  AlphabetSymbols.one,
  AlphabetSymbols.zero,
  AlphabetSymbols.one,
];

export const transitions: TransitionsLine = [
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.zero,
    symbolOnStack: StackSymbols.z,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.zero,
    symbolOnStack: StackSymbols.z,
    endState: States.q1,
    stackMovement: StackMovement.SET_Z,
  },
];
