import { Stack } from "./structures";
import { textLine, transitions } from "./transitions";
import { StackMovement, StackSymbolsType } from "./types";
import { StartState } from "./constants";
import { isStackSymbol } from "./utils";

type MovementsObjectInterface = Record<StackMovement, any>;

const main = () => {
  //Заведем стек, что бы класть туда наши символы
  const stack = new Stack();

  let currentState = StartState;

  //   Тут делаем методы для движения, что обрабатывать соббытия в стеке
  const movementMethods: MovementsObjectInterface = {
    [StackMovement.POP]: () => stack.pop(),
    [StackMovement.PUSH]: (val: StackSymbolsType) => {
      stack.push(val);
    },
    [StackMovement.SET_Z]: () => stack.setZ(),
  };

  const line = [...textLine];

  for (const symbol of line) {
    const stateNow = transitions.find(
      ({ from, symbolOnLine, symbolOnStack }) =>
        from === currentState &&
        symbolOnLine === symbol &&
        stack.getTop() === symbolOnStack
    );
    if (!stateNow) {
      return;
    }

    if (
      stateNow.stackMovement === StackMovement.PUSH &&
      !isStackSymbol(stateNow.symbolOnLine)
    ) {
      console.log("Ошибка, пытаемся запушить символ не из алфавита стека");
      return;
    }
    movementMethods[stateNow.stackMovement](stateNow.symbolOnLine);
    currentState = stateNow.endState;
    stack.getStackText();
  }
};

main();
