enum States {
  q0 = "q0",
  q1 = "q1",
}

enum AlphabetSymbols {
  zero = "0",
  one = "1",
}

enum StackSymbols {
  z = "z",
  zero = "0",
}

const StartState = States.q0;
const StartStackSymbol = StackSymbols.z;
const EndState = States.q0;

enum StackMovement {
  pop = "pop",
  push = "push",
}

interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols;
  symbolOnStack: StackSymbols;
  endState: States;
  stackMovement: StackMovement;
}

const transitions: Transition[] = [
  {
    from: States.q0,
    symbolOnLine: AlphabetSymbols.zero,
    symbolOnStack: StackSymbols.z,
    endState: States.q0,
    stackMovement: StackMovement.push,
  },
];
