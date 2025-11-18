import { join } from "path";
import { Stack } from "./structures";
import { transitions } from "./transitions";
import { StackMovement, Transition, TupleToUnion } from "./types";
import {
  StartState,
  AlphabetSymbols,
  Z,
  StackSybmols,
  EndState,
} from "./language";
import { isStackSymbol, isSymbol } from "./utils";
import { readFileSync } from "fs";
import { Lambda } from "./constants";

type MovementsObjectInterface = Record<StackMovement, any>;

const main = () => {
  //Заведем стек, что бы класть туда наши символы
  const stack = new Stack();

  let currentState = StartState;

  //   Тут делаем методы для движения, что обрабатывать соббытия в стеке
  const movementMethods: MovementsObjectInterface = {
    [StackMovement.POP]: () => stack.pop(),
    [StackMovement.PUSH]: (val: TupleToUnion<typeof StackSybmols>) => {
      stack.push(val);
    },
    [StackMovement.NONE]: () => {},
    [StackMovement.REPLACE]: (val: TupleToUnion<typeof StackSybmols>) => {
      stack.pop();
      stack.push(val);
    },
  };

  // Читаем текст из файла
  const textFilePath = join(process.cwd(), "src", "text.txt");
  const textContent = readFileSync(textFilePath, "utf-8").trim();
  // Преобразуем строку в массив символов
  const line: string[] = [...textContent.split("")];
  let position = 0;
  let transitionsCount = 0;

  while (true) {
    const symbol = line[position] || Lambda;

    if (transitionsCount > line.length + 50) {
      console.log(`Ошибка - программа зациклилась`);
      return;
    }

    if (position === line.length && currentState === EndState) {
      console.log("Строка ПРИНЯТА. Финальное состояние является принимающим.");
      return;
    }

    const stateNow = transitions.find(
      ({ from, symbolOnLine, symbolOnStack }) =>
        from === currentState &&
        symbolOnLine === symbol &&
        stack.peek() === symbolOnStack
    );

    if (!stateNow) {
      console.log(
        `Текущее состояние: ${currentState}, текущий символ: ${symbol}, текущий символ на стеке: ${stack.peek()}, позиция в строке: ${position}`,
        `Ошибка в символе  ${symbol}, нет перехода, удовлетворяющего состоянию и символу, завершаем программу`
      );
      return;
    }

    if (
      stateNow.stackMovement === StackMovement.PUSH &&
      isSymbol(stateNow.symbolOnLine) &&
      !isStackSymbol(stateNow.symbolOnLine)
    ) {
      console.log(
        `Текущее состояние: ${currentState}, текущий символ: ${symbol}, текущий символ на стеке: ${stack.peek()}, позиция в строке: ${position}`,
        `Ошибка - обнаружен символ, пытаются положить в стек, но он не попадает под алфавит стека`
      );
      return;
    }

    transitionsCount++;
    movementMethods[stateNow.stackMovement](stateNow.symbolOnLine);

    currentState = stateNow.endState;
    if (symbol !== Lambda) {
      position++;
    }
  }
};

main();
