import { Lambda, Z, Any, Popped } from "./constants";

export enum StackMovement {
  POP = "POP", // снять со стека
  PUSH = "PUSH", // положить symbolToPush
  NONE = "NONE", // ничего со стеком
}

export interface Transition {
  from: string;
  symbolOnLine: string | typeof Lambda; // входной символ или λ
  symbolOnStack: string | typeof Z | typeof Any; // символ на стеке, Z или * (любой)
  endState: string;
  stackMovement: StackMovement;
  symbolToPush?: string; // что класть в стек (для PUSH)
  output?: string | typeof Popped; // литеральный выход (если не задан — ничего)
}

export type TupleToUnion<T extends readonly unknown[]> = T[number];
