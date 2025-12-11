// Преобразование инфиксного выражения в ОПЗ (обратную польскую запись)
// Упрощённая версия алгоритма Shunting Yard для выражений без скобок
// Поддерживает: однобуквенные операнды (a-z), операторы +, -, *, /
//
// Пример: a+b*c → abc*+
//         a*b+c → ab*c+
//
// Приоритеты: * и / выше, чем + и -
// Используем состояния для управления приоритетами

import { StackMovement, Transition } from "../types";
import { Lambda, Epsilon, Z, Any } from "../constants";

// Состояния:
// q0 - начало, ждём операнд
// q1 - прочитали операнд, ждём оператор или конец
// q_flush - выталкиваем всё со стека в конце

const transitions: Transition[] = [
  // --- Чтение операндов (a-z) - сразу на выход ---
  ...[
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ].map(
    (char) =>
      ({
        from: "q0",
        symbolOnLine: char,
        symbolOnStack: Any,
        endState: "q1",
        stackMovement: StackMovement.NONE,
        output: char, // операнд сразу на выход
      } as Transition)
  ),

  // После операнда можем читать ещё операнд (для многозначных — но тут просто)
  ...[
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ].map(
    (char) =>
      ({
        from: "q1",
        symbolOnLine: char,
        symbolOnStack: Any,
        endState: "q1",
        stackMovement: StackMovement.NONE,
        output: char,
      } as Transition)
  ),

  // --- Операторы низкого приоритета (+, -) ---
  // Если на стеке пусто или Z — просто кладём
  {
    from: "q1",
    symbolOnLine: "+",
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "+",
  },
  {
    from: "q1",
    symbolOnLine: "-",
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "-",
  },

  // Если на стеке оператор — сначала выталкиваем его (любой оператор >= по приоритету)
  // + и - выталкивают +, -, *, /
  ...(["+", "-", "*", "/"] as const).flatMap((stackOp) => [
    {
      from: "q1",
      symbolOnLine: "+",
      symbolOnStack: stackOp,
      endState: "q_pop_for_plus",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
    {
      from: "q1",
      symbolOnLine: "-",
      symbolOnStack: stackOp,
      endState: "q_pop_for_minus",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
  ]),

  // После выталкивания для + — продолжаем выталкивать или кладём +
  {
    from: "q_pop_for_plus",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "+",
  },
  ...(["+", "-", "*", "/"] as const).map(
    (stackOp) =>
      ({
        from: "q_pop_for_plus",
        symbolOnLine: Lambda,
        symbolOnStack: stackOp,
        endState: "q_pop_for_plus",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // После выталкивания для - — продолжаем выталкивать или кладём -
  {
    from: "q_pop_for_minus",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "-",
  },
  ...(["+", "-", "*", "/"] as const).map(
    (stackOp) =>
      ({
        from: "q_pop_for_minus",
        symbolOnLine: Lambda,
        symbolOnStack: stackOp,
        endState: "q_pop_for_minus",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // --- Операторы высокого приоритета (*, /) ---
  // Если на стеке пусто, Z, + или - — просто кладём
  {
    from: "q1",
    symbolOnLine: "*",
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  {
    from: "q1",
    symbolOnLine: "/",
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },
  {
    from: "q1",
    symbolOnLine: "*",
    symbolOnStack: "+",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  {
    from: "q1",
    symbolOnLine: "*",
    symbolOnStack: "-",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  {
    from: "q1",
    symbolOnLine: "/",
    symbolOnStack: "+",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },
  {
    from: "q1",
    symbolOnLine: "/",
    symbolOnStack: "-",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },

  // * и / выталкивают только * и /
  ...(["*", "/"] as const).flatMap((stackOp) => [
    {
      from: "q1",
      symbolOnLine: "*",
      symbolOnStack: stackOp,
      endState: "q_pop_for_mul",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
    {
      from: "q1",
      symbolOnLine: "/",
      symbolOnStack: stackOp,
      endState: "q_pop_for_div",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
  ]),

  // После выталкивания для * — продолжаем или кладём
  {
    from: "q_pop_for_mul",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  {
    from: "q_pop_for_mul",
    symbolOnLine: Lambda,
    symbolOnStack: "+",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  {
    from: "q_pop_for_mul",
    symbolOnLine: Lambda,
    symbolOnStack: "-",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "*",
  },
  ...(["*", "/"] as const).map(
    (stackOp) =>
      ({
        from: "q_pop_for_mul",
        symbolOnLine: Lambda,
        symbolOnStack: stackOp,
        endState: "q_pop_for_mul",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // После выталкивания для / — продолжаем или кладём
  {
    from: "q_pop_for_div",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },
  {
    from: "q_pop_for_div",
    symbolOnLine: Lambda,
    symbolOnStack: "+",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },
  {
    from: "q_pop_for_div",
    symbolOnLine: Lambda,
    symbolOnStack: "-",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "/",
  },
  ...(["*", "/"] as const).map(
    (stackOp) =>
      ({
        from: "q_pop_for_div",
        symbolOnLine: Lambda,
        symbolOnStack: stackOp,
        endState: "q_pop_for_div",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // --- Конец входа: выталкиваем всё со стека ---
  {
    from: "q1",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "qf",
    stackMovement: StackMovement.NONE,
  },
  ...(["+", "-", "*", "/"] as const).map(
    (stackOp) =>
      ({
        from: "q1",
        symbolOnLine: Lambda,
        symbolOnStack: stackOp,
        endState: "q1", // остаёмся и продолжаем выталкивать
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),
];

export default {
  transitions,
  startState: "q0",
  endStates: ["qf"],
  acceptOnEmptyStack: true,
};
