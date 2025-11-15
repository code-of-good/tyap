export enum States {
  q0 = "q0",
  q1 = "q1",
}

export enum AlphabetSymbols {
  zero = "0",
  one = "1",
}

export enum StackSymbols {
  z = "z",
  zero = "0",
}

export const StartState = States.q0;
export const StartStackSymbol = StackSymbols.z;
export const EndState = States.q0;

export enum StackMovement {
  POP = "POP",
  PUSH = "PUSH",
  SET_Z = "SET_Z",
}

export interface Transition {
  from: States;
  symbolOnLine: AlphabetSymbols;
  symbolOnStack: StackSymbols;
  endState: States;
  stackMovement: StackMovement;
}

export interface LastTransition extends Transition {
  endState: States.q1;
  stackMovement: StackMovement.SET_Z;
}

export type TransitionsLine = [...Transition[], LastTransition];
