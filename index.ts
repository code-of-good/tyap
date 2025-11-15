import { Stack } from "./structures";
import { textLine, transitions } from "./transitions";
import { StackMovement, StackSymbols, StartState, States } from "./types";

type MovementsObjectInterface = Record<StackMovement, any>;

const main = () => {
  //Заведем стек, что бы класть туда наши символы
  const stack = new Stack();

  let currentState = StartState;

  //   Тут делаем методы для движения, что обрабатывать соббытия в стеке
  const movementMethods: MovementsObjectInterface = {
    [StackMovement.POP]: () => stack.pop(),
    [StackMovement.PUSH]: (val: StackSymbols) => {
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
    movementMethods[stateNow.stackMovement](stateNow.symbolOnLine);
    currentState = stateNow.endState;
    console.log(stack.getStackText());
  }
};

main();
