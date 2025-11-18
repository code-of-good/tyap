import { StackSybmols } from "./language";
import { TupleToUnion } from "./types";
import { Z } from "./constants";

export class Stack {
  private items: TupleToUnion<typeof StackSybmols>[] = [Z];

  push(item: TupleToUnion<typeof StackSybmols>) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getStackText() {
    return this.items.join("");
  }
}
