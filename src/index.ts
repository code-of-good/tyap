import { join } from "path";
import { Stack } from "./structures";
import { StackMovement, Transition } from "./types";
import { readFileSync } from "fs";
import { Lambda, Epsilon, Z, Any, EmptySet, Popped } from "./constants";

interface TransducerConfig {
  transitions: Transition[];
  startState: string;
  endStates: string[];
  // Если true — принимаем только при пустом стеке
  acceptOnEmptyStack?: boolean;
}

export const runTransducer = (
  input: string,
  config: TransducerConfig
): string | null => {
  const {
    transitions,
    startState,
    endStates,
    acceptOnEmptyStack = true,
  } = config;

  const stack = new Stack();
  let currentState = startState;
  const outputTape: string[] = [];
  const line = input.split("");

  let position = 0;
  let transitionsCount = 0;
  const maxTransitions = line.length * 10 + 100;

  console.log(`Входная строка: "${input}"`);
  console.log(`Начальное состояние: ${startState}`);
  console.log("---");

  while (true) {
    const symbol = line[position] ?? Lambda;
    const stackTop = stack.peek() ?? "";

    // Защита от зацикливания
    if (transitionsCount > maxTransitions) {
      console.log(`❌ Ошибка — программа зациклилась`);
      console.log(`Частичный выход: ${outputTape.join("")}`);
      return null;
    }

    // Проверка условия принятия
    const inputConsumed = position >= line.length;
    const inFinalState = endStates.includes(currentState);
    const stackEmpty = stack.isEmpty() || stack.peek() === Z;

    if (inputConsumed && inFinalState && (!acceptOnEmptyStack || stackEmpty)) {
      // Перед завершением проверяем, есть ли λ-переходы из текущего состояния
      const lambdaTransition = findTransition(
        transitions,
        currentState,
        Lambda,
        stackTop
      );
      if (!lambdaTransition) {
        console.log("---");
        console.log("✅ Строка ПРИНЯТА.");
        console.log(`Выходная строка: "${outputTape.join("")}"`);
        return outputTape.join("");
      }
    }

    // Ищем подходящий переход
    const transition = findTransition(
      transitions,
      currentState,
      symbol,
      stackTop
    );

    if (!transition) {
      // Пробуем λ-переход
      const lambdaTransition = findTransition(
        transitions,
        currentState,
        Lambda,
        stackTop
      );

      if (lambdaTransition) {
        executeTransition(
          lambdaTransition,
          stack,
          outputTape,
          currentState,
          Lambda
        );
        currentState = lambdaTransition.endState;
        transitionsCount++;
        continue;
      }

      console.log(
        `❌ Нет перехода: состояние=${currentState}, символ="${symbol}", стек=[${stack
          .getItems()
          .join(", ")}]`
      );
      console.log(`Частичный выход: ${outputTape.join("")}`);
      return null;
    }

    executeTransition(transition, stack, outputTape, currentState, symbol);
    currentState = transition.endState;

    // Сдвигаем позицию только если читали реальный символ (не λ)
    if (transition.symbolOnLine !== Lambda) {
      position++;
    }

    transitionsCount++;
  }
};

// Поиск перехода с учётом wildcard (Any)
const findTransition = (
  transitions: Transition[],
  state: string,
  symbol: string,
  stackTop: string
): Transition | undefined => {
  // Сначала ищем точное совпадение
  let found = transitions.find(
    (t) =>
      t.from === state &&
      t.symbolOnLine === symbol &&
      t.symbolOnStack === stackTop
  );

  if (found) return found;

  // Потом ищем с wildcard на стеке
  found = transitions.find(
    (t) =>
      t.from === state && t.symbolOnLine === symbol && t.symbolOnStack === Any
  );

  return found;
};

// Выполнение перехода
const executeTransition = (
  transition: Transition,
  stack: Stack,
  outputTape: string[],
  fromState: string,
  symbol: string
): void => {
  const stackBefore = stack.peek() ?? EmptySet;
  let poppedSymbol: string | undefined;

  // Операция со стеком
  switch (transition.stackMovement) {
    case StackMovement.POP:
      poppedSymbol = stack.pop();
      break;

    case StackMovement.PUSH:
      if (transition.symbolToPush) {
        stack.push(transition.symbolToPush);
      }
      break;

    case StackMovement.REPLACE:
      stack.pop();
      if (transition.symbolToPush) {
        stack.push(transition.symbolToPush);
      }
      break;

    case StackMovement.NONE:
      break;
  }

  // Записываем выход
  if (transition.output && transition.output !== Epsilon) {
    if (transition.output === Popped) {
      // Выводим снятый символ (если он есть и не Z)
      if (poppedSymbol && poppedSymbol !== Z) {
        outputTape.push(poppedSymbol);
      }
    } else {
      // Выводим литеральный символ
      outputTape.push(transition.output);
    }
  }

  // Логируем переход
  const outputStr =
    transition.output === Popped && poppedSymbol
      ? `→выход:${poppedSymbol}`
      : transition.output && transition.output !== Epsilon
      ? `→выход:${transition.output}`
      : "";

  console.log(
    `(${fromState}, "${symbol === Lambda ? "λ" : symbol}", ${stackBefore}) → ` +
      `(${transition.endState}, ${transition.stackMovement}${
        transition.symbolToPush ? `:${transition.symbolToPush}` : ""
      }) ${outputStr}`
  );
};

// Для обратной совместимости — загрузка из файла
const main = () => {
  // Динамический импорт конфигурации
  const configPath = process.argv[2] || "infix-to-rpn";

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require(`./examples/${configPath}`);

    const textFilePath = join(process.cwd(), "src", "text.txt");
    const input = readFileSync(textFilePath, "utf-8").trim();

    console.log(`\n=== МП-преобразователь: ${configPath} ===\n`);
    runTransducer(input, config.default || config);
  } catch (e) {
    console.error(`Не удалось загрузить конфигурацию: ${configPath}`);
    console.error(e);
  }
};

main();
