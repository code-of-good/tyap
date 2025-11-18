import { Lambda, Z } from "./constants";
import { AlphabetSymbols, EndStates, States } from "./language";
import { StackMovement, Transition } from "./types";

export const transitions: Transition[] = [
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.POP,
  },
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.POP,
  },
  {
    from: States.q1,
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: States.qf,
    stackMovement: StackMovement.POP,
  },
  {
    from: States.q0,
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: States.qf,
    stackMovement: StackMovement.POP,
  },
];
