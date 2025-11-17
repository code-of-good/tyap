import { StackMovement, TransitionsLine } from "./types";
import { AlphabetSymbols, EndState, States, Z } from "./language";
import { Lambda } from "./constants";

export const transitions: TransitionsLine = [
  // δ(q₀,a,Z)={(q₀,aZ)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  // δ(q₀,a,a)={(q₀,aa)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  // δ(q₀,b,a)={(q₁,a)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.NONE,
  },
  // δ(q₁,b,a)={(q₁,a)}
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.NONE,
  },
  // δ(q₁,c,a)={(q₂,a)}
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.NONE,
  },

  // δ(q₂,c,a)={(q₃,ε)}
  {
    from: States.q2,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q3,
    stackMovement: StackMovement.POP,
  },

  {
    from: States.q3,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.NONE,
  },

  {
    from: States.q3,
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: EndState,
    stackMovement: StackMovement.POP,
  },

  {
    from: States.q3,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.NONE,
  },
];
