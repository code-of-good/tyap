import { StackSymbolsType } from "./types";
import { Z } from "./constants";

export class Stack {
  private items: StackSymbolsType[] = [Z];

  push(item: StackSymbolsType) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  setZ() {
    return this.items.push(Z);
  }

  getTop() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getStackText() {
    return this.items.join("");
  }
}
