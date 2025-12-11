// Преобразование инфиксного выражения в ОПЗ СО СКОБКАМИ
// Полный алгоритм Shunting Yard
// Поддерживает: операнды (a-z, 0-9), операторы +, -, *, /, скобки ()
//
// Примеры:
//   (a+b)*c → ab+c*
//   a*(b+c) → abc+*
//   a+b*c   → abc*+

import { StackMovement, Transition } from "../types";
import { Lambda, Z, Any, Popped } from "../constants";

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
const highPriorityOps = ["*", "/"] as const;
const lowPriorityStackSymbols = [Z, "("] as const;

// Helper: генерация переходов для оператора с выталкиванием
const createPopStateTransitions = (
  stateName: string,
  operator: string,
  stackSymbols: readonly string[]
): Transition[] => [
  // Кладем оператор если дошли до Z или (
  ...lowPriorityStackSymbols.map(
    (sym) =>
      ({
        from: stateName,
        symbolOnLine: Lambda,
        symbolOnStack: sym,
        endState: "q0",
        stackMovement: StackMovement.PUSH,
        symbolToPush: operator,
      } as Transition)
  ),
  // Продолжаем выталкивать указанные операторы
  ...stackSymbols.map(
    (op) =>
      ({
        from: stateName,
        symbolOnLine: Lambda,
        symbolOnStack: op,
        endState: stateName,
        stackMovement: StackMovement.POP,
        output: Popped,
      } as Transition)
  ),
];

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
        stackMovement: StackMovement.POP,
        output: Popped,
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
        stackMovement: StackMovement.POP,
        output: Popped,
      } as Transition)
  ),

  // --- Операторы + и - (низкий приоритет) ---
  // Если на стеке Z или ( — просто кладём
  ...["+", "-"].flatMap((op) =>
    lowPriorityStackSymbols.map(
      (sym) =>
        ({
          from: "q1",
          symbolOnLine: op,
          symbolOnStack: sym,
          endState: "q0",
          stackMovement: StackMovement.PUSH,
          symbolToPush: op,
        } as Transition)
    )
  ),

  // + и - выталкивают любые операторы
  ...operators.flatMap((stackOp) => [
    {
      from: "q1",
      symbolOnLine: "+",
      symbolOnStack: stackOp,
      endState: "q_pop_plus",
      stackMovement: StackMovement.POP,
      output: Popped,
    } as Transition,
    {
      from: "q1",
      symbolOnLine: "-",
      symbolOnStack: stackOp,
      endState: "q_pop_minus",
      stackMovement: StackMovement.POP,
      output: Popped,
    } as Transition,
  ]),

  // Состояния выталкивания для + и -
  ...createPopStateTransitions("q_pop_plus", "+", operators),
  ...createPopStateTransitions("q_pop_minus", "-", operators),

  // --- Операторы * и / (высокий приоритет) ---
  // Кладём если на стеке Z, (, + или -
  ...highPriorityOps.flatMap((op) => [
    ...lowPriorityStackSymbols.map(
      (sym) =>
        ({
          from: "q1",
          symbolOnLine: op,
          symbolOnStack: sym,
          endState: "q0",
          stackMovement: StackMovement.PUSH,
          symbolToPush: op,
        } as Transition)
    ),
    ...["+", "-"].map(
      (sym) =>
        ({
          from: "q1",
          symbolOnLine: op,
          symbolOnStack: sym,
          endState: "q0",
          stackMovement: StackMovement.PUSH,
          symbolToPush: op,
        } as Transition)
    ),
  ]),

  // * и / выталкивают только * и /
  ...highPriorityOps.flatMap((stackOp) => [
    {
      from: "q1",
      symbolOnLine: "*",
      symbolOnStack: stackOp,
      endState: "q_pop_mul",
      stackMovement: StackMovement.POP,
      output: Popped,
    } as Transition,
    {
      from: "q1",
      symbolOnLine: "/",
      symbolOnStack: stackOp,
      endState: "q_pop_div",
      stackMovement: StackMovement.POP,
      output: Popped,
    } as Transition,
  ]),

  // Состояния выталкивания для * и /
  ...createPopStateTransitions("q_pop_mul", "*", highPriorityOps),
  ...createPopStateTransitions("q_pop_div", "/", highPriorityOps),

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
        stackMovement: StackMovement.POP,
        output: Popped,
      } as Transition)
  ),
];

export default {
  transitions,
  startState: "q0",
  endStates: ["qf"],
  acceptOnEmptyStack: true,
};
