import { StackMovement, TransitionsLine } from "./types";
import { AlphabetSymbols, States, Z } from "./language";
import { Epsilon } from "./constants";

export const textLine: (AlphabetSymbols | typeof Epsilon)[] = [
  AlphabetSymbols.zero,
  AlphabetSymbols.zero,
  AlphabetSymbols.one,
  AlphabetSymbols.one,
  Epsilon,
];

export const transitions: TransitionsLine = [
  // δ(q₀,0,Z)={(q₀,0Z)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.zero,
    symbolOnStack: Z,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  // δ(q₀,0,0)={(q₀,00)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.zero,
    symbolOnStack: AlphabetSymbols.zero,
    endState: States.q0,
    stackMovement: StackMovement.PUSH,
  },
  // δ(q₀,1,0)={(q₁,λ)}
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.one,
    symbolOnStack: AlphabetSymbols.zero,
    endState: States.q1,
    stackMovement: StackMovement.POP,
  },
  // δ(q₁,1,0)={(q₁,λ)}
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.one,
    symbolOnStack: AlphabetSymbols.zero,
    endState: States.q1,
    stackMovement: StackMovement.POP,
  },
  // δ(q₀,λ,Z)={(q₀,λ)}
  {
    from: States.q0,
    symbolOnLine: Epsilon,
    symbolOnStack: Z,
    endState: States.q0,
    stackMovement: StackMovement.POP,
  },

  // δ(q₁,λ,Z)={(q₀,Z)}
  {
    from: States.q1,
    symbolOnLine: Epsilon,
    symbolOnStack: Z,
    endState: States.q0,
    stackMovement: StackMovement.NONE,
  },
];

