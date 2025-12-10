import { Lambda, Epsilon, Z } from "./constants";
import { AlphabetSymbols, OutputSymbols, States } from "./language";
import { StackMovement, Transition } from "./types";

// Каждый переход теперь имеет поле output — выходной символ преобразователя
export const transitions: Transition[] = [
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q1,
    stackMovement: StackMovement.PUSH,
    output: OutputSymbols.x, // выдаём x при чтении первого a
  },
  {
    from: States.q1,
    symbolOnLine: AlphabetSymbols.b,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q0,
    stackMovement: StackMovement.NONE,
    output: OutputSymbols.y, // выдаём y при чтении b
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q1,
    stackMovement: StackMovement.PUSH,
    output: OutputSymbols.x, // выдаём x при чтении a
  },
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.NONE,
    output: OutputSymbols.w, // выдаём w при переходе на c
  },
  {
    from: States.q2,
    symbolOnLine: AlphabetSymbols.c,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q2,
    stackMovement: StackMovement.POP,
    output: OutputSymbols.w, // выдаём w при чтении c
  },
  {
    from: States.q2,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q3,
    stackMovement: StackMovement.PUSH,
    output: OutputSymbols.x,
  },
  {
    from: States.q3,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: AlphabetSymbols.a,
    endState: States.q4,
    stackMovement: StackMovement.POP,
    output: OutputSymbols.x,
  },
  {
    from: States.q4,
    symbolOnLine: AlphabetSymbols.a,
    symbolOnStack: Z,
    endState: States.q3,
    stackMovement: StackMovement.PUSH,
    output: OutputSymbols.x,
  },
  {
    from: States.q4,
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: States.qf,
    stackMovement: StackMovement.POP,
    output: Epsilon, // пустой выход при завершении
  },
];
