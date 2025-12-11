// Оригинальная грамматика: ab^n c^{n+1} a^{2k}
// Пример: abccaa, abbbccccaaaa

import { StackMovement, Transition } from "../types";
import { Lambda, Epsilon, Z } from "../constants";

const transitions: Transition[] = [
  {
    from: "q0",
    symbolOnLine: "a",
    symbolOnStack: Z,
    endState: "q1",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "a",
    output: "x",
  },
  {
    from: "q1",
    symbolOnLine: "b",
    symbolOnStack: "a",
    endState: "q0",
    stackMovement: StackMovement.NONE,
    output: "y",
  },
  {
    from: "q0",
    symbolOnLine: "a",
    symbolOnStack: "a",
    endState: "q1",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "a",
    output: "x",
  },
  {
    from: "q0",
    symbolOnLine: "c",
    symbolOnStack: "a",
    endState: "q2",
    stackMovement: StackMovement.NONE,
    output: "w",
  },
  {
    from: "q2",
    symbolOnLine: "c",
    symbolOnStack: "a",
    endState: "q2",
    stackMovement: StackMovement.POP,
    output: "w",
  },
  {
    from: "q2",
    symbolOnLine: "a",
    symbolOnStack: Z,
    endState: "q3",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "a",
    output: "x",
  },
  {
    from: "q3",
    symbolOnLine: "a",
    symbolOnStack: "a",
    endState: "q4",
    stackMovement: StackMovement.POP,
    output: "x",
  },
  {
    from: "q4",
    symbolOnLine: "a",
    symbolOnStack: Z,
    endState: "q3",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "a",
    output: "x",
  },
  {
    from: "q4",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "qf",
    stackMovement: StackMovement.NONE,
    output: Epsilon,
  },
];

export default {
  transitions,
  startState: "q0",
  endStates: ["qf"],
  acceptOnEmptyStack: true,
};

