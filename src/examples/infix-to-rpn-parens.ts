// Преобразование инфиксного выражения в ОПЗ СО СКОБКАМИ
// Полный алгоритм Shunting Yard
// Поддерживает: операнды (a-z, 0-9), операторы +, -, *, /, скобки ()
//
// Примеры:
//   (a+b)*c → ab+c*
//   a*(b+c) → abc+*
//   a+b*c   → abc*+

import { StackMovement, Transition } from "../types";
import { Lambda, Z, Any } from "../constants";

const operands = [
  "a",
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
] as const;

const operators = ["+", "-", "*", "/"] as const;

const transitions: Transition[] = [
  // --- Чтение операндов: сразу на выход ---
  ...operands.map(
    (char) =>
      ({
        from: "q0",
        symbolOnLine: char,
        symbolOnStack: Any,
        endState: "q1",
        stackMovement: StackMovement.NONE,
        output: char,
      } as Transition)
  ),

  ...operands.map(
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

  // --- Открывающая скобка: всегда на стек ---
  {
    from: "q0",
    symbolOnLine: "(",
    symbolOnStack: Any,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "(",
  },
  {
    from: "q1",
    symbolOnLine: "(",
    symbolOnStack: Any,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "(",
  },

  // --- Закрывающая скобка: выталкиваем до ( ---
  // Если на стеке (, просто удаляем её
  {
    from: "q1",
    symbolOnLine: ")",
    symbolOnStack: "(",
    endState: "q1",
    stackMovement: StackMovement.POP, // удаляем (, не выводим
  },
  // Если на стеке оператор, выталкиваем на выход
  ...operators.map(
    (op) =>
      ({
        from: "q1",
        symbolOnLine: ")",
        symbolOnStack: op,
        endState: "q_paren",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // Состояние выталкивания для )
  {
    from: "q_paren",
    symbolOnLine: Lambda,
    symbolOnStack: "(",
    endState: "q1",
    stackMovement: StackMovement.POP,
  },
  ...operators.map(
    (op) =>
      ({
        from: "q_paren",
        symbolOnLine: Lambda,
        symbolOnStack: op,
        endState: "q_paren",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // --- Операторы + и - (низкий приоритет) ---
  // Если на стеке Z или ( — просто кладём
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
  {
    from: "q1",
    symbolOnLine: "+",
    symbolOnStack: "(",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "+",
  },
  {
    from: "q1",
    symbolOnLine: "-",
    symbolOnStack: "(",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "-",
  },

  // + и - выталкивают любые операторы
  ...operators.flatMap((stackOp) => [
    {
      from: "q1",
      symbolOnLine: "+",
      symbolOnStack: stackOp,
      endState: "q_pop_plus",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
    {
      from: "q1",
      symbolOnLine: "-",
      symbolOnStack: stackOp,
      endState: "q_pop_minus",
      stackMovement: StackMovement.POP_OUTPUT,
    } as Transition,
  ]),

  // Состояния выталкивания для + и -
  {
    from: "q_pop_plus",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "+",
  },
  {
    from: "q_pop_plus",
    symbolOnLine: Lambda,
    symbolOnStack: "(",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "+",
  },
  ...operators.map(
    (op) =>
      ({
        from: "q_pop_plus",
        symbolOnLine: Lambda,
        symbolOnStack: op,
        endState: "q_pop_plus",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  {
    from: "q_pop_minus",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "-",
  },
  {
    from: "q_pop_minus",
    symbolOnLine: Lambda,
    symbolOnStack: "(",
    endState: "q0",
    stackMovement: StackMovement.PUSH,
    symbolToPush: "-",
  },
  ...operators.map(
    (op) =>
      ({
        from: "q_pop_minus",
        symbolOnLine: Lambda,
        symbolOnStack: op,
        endState: "q_pop_minus",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition)
  ),

  // --- Операторы * и / (высокий приоритет) ---
  // Кладём если на стеке Z, (, + или -
  ...operators
    .filter((op) => op === "*" || op === "/")
    .flatMap((op) => [
      {
        from: "q1",
        symbolOnLine: op,
        symbolOnStack: Z,
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: "q1",
        symbolOnLine: op,
        symbolOnStack: "(",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: "q1",
        symbolOnLine: op,
        symbolOnStack: "+",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: "q1",
        symbolOnLine: op,
        symbolOnStack: "-",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
    ]),

  // * и / выталкивают только * и /
  ...operators
    .filter((op) => op === "*" || op === "/")
    .flatMap((stackOp) => [
      {
        from: "q1",
        symbolOnLine: "*",
        symbolOnStack: stackOp,
        endState: "q_pop_mul",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition,
      {
        from: "q1",
        symbolOnLine: "/",
        symbolOnStack: stackOp,
        endState: "q_pop_div",
        stackMovement: StackMovement.POP_OUTPUT,
      } as Transition,
    ]),

  // Состояния выталкивания для * и /
  ...["q_pop_mul", "q_pop_div"].flatMap((state, idx) => {
    const op = idx === 0 ? "*" : "/";
    return [
      {
        from: state,
        symbolOnLine: Lambda,
        symbolOnStack: Z,
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: state,
        symbolOnLine: Lambda,
        symbolOnStack: "(",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: state,
        symbolOnLine: Lambda,
        symbolOnStack: "+",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      {
        from: state,
        symbolOnLine: Lambda,
        symbolOnStack: "-",
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: op,
      } as Transition,
      ...operators
        .filter((op) => op === "*" || op === "/")
        .map(
          (stackOp) =>
            ({
              from: state,
              symbolOnLine: Lambda,
              symbolOnStack: stackOp,
              endState: state,
              stackMovement: StackMovement.POP_OUTPUT,
            } as Transition)
        ),
    ];
  }),

  // --- Конец входа: выталкиваем всё со стека ---
  {
    from: "q1",
    symbolOnLine: Lambda,
    symbolOnStack: Z,
    endState: "qf",
    stackMovement: StackMovement.NONE,
  },
  ...operators.map(
    (op) =>
      ({
        from: "q1",
        symbolOnLine: Lambda,
        symbolOnStack: op,
        endState: "q1",
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
