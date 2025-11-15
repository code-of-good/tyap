import { StackSymbols } from "./types";

export class Stack {
  private items: StackSymbols[] = [StackSymbols.z];

  push(item: StackSymbols) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  setZ() {
    return this.items.push(StackSymbols.z);
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
