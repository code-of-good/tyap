import { Stack } from "./structures";
import { textLine, transitions } from "./transitions";
import { StackMovement, StackSymbolsType } from "./types";
import { StartState } from "./constants";
import { isStackSymbol, isSymbol } from "./utils";

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
    [StackMovement.NONE]: () => {},
    [StackMovement.REPLACE]: (val: StackSymbolsType) => {
      stack.pop();
      stack.push(val);
    },
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
      isSymbol(stateNow.symbolOnLine) &&
      !isStackSymbol(stateNow.symbolOnLine)
    ) {
      return;
    }

    movementMethods[stateNow.stackMovement](stateNow.symbolOnLine);
    console.log(stateNow, stack.getStackText(), symbol);

    currentState = stateNow.endState;
  }
};

main();
