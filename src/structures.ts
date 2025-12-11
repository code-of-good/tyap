import { Z } from "./constants";

export class Stack {
  private items: string[] = [Z];

  push(item: string) {
    this.items.push(item);
  }

  pop(): string | undefined {
    return this.items.pop();
  }

  peek(): string | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getStackText(): string {
    return this.items.join("");
  }

  // Для отладки
  getItems(): string[] {
    return [...this.items];
  }
}
