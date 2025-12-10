import { Lambda, Z } from "./constants";
import { AlphabetSymbols, States } from "./language";
import { StackMovement, Transition } from "./types";

export const transitions: Transition[] = [
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q1,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q0,
    stackMovement: StackMovement.NONE,
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.NONE,
  },
  {
    from: States.q2,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.POP,
  },
  {
    from: States.q2,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q3,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q3,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q4,
    stackMovement: StackMovement.POP,
  },
  {
    from: States.q4,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q3,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q4,
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: States.qf,
    stackMovement: StackMovement.POP,
  },
];
