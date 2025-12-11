import { Lambda, Epsilon, Z, Any, Popped } from "./constants";

export enum StackMovement {
  POP = "POP", // снять со стека
  PUSH = "PUSH", // положить symbolToPush
  NONE = "NONE", // ничего со стеком
  REPLACE = "REPLACE", // снять и положить symbolToPush
}

export interface Transition {
  from: string;
  symbolOnLine: string | typeof Lambda; // входной символ или λ
  symbolOnStack: string | typeof Z | typeof Any; // символ на стеке, Z или * (любой)
  endState: string;
  stackMovement: StackMovement;
  symbolToPush?: string; // что класть в стек (для PUSH/REPLACE)
  output?: string | typeof Epsilon | typeof Popped; // литеральный выход (если не задан — ничего)
}

export type TupleToUnion<T extends readonly unknown[]> = T[number];
