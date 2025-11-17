import { join } from "path";
import { Stack } from "./structures";
import { transitions } from "./transitions";
import { StackMovement, Transition, TupleToUnion } from "./types";
import { StartState, AlphabetSymbols, Z, StackSybmols } from "./language";
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
  const line: string[] = [...textContent.split(""), Lambda];
  let position = 0;
  for (const symbol of line) {
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
      return;
    }

    movementMethods[stateNow.stackMovement](stateNow.symbolOnLine);

    currentState = stateNow.endState;
    position++;
  }
  console.log(
    "Программа завершена успешно, длина стека: ",
    stack.getStackText().length
  );
  console.log("Стек: ", stack.getStackText() || "Стек пуст");
};

main();
