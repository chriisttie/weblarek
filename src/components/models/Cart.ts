import { EventEmitter } from "../Events";
import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  add(product: IProduct): void {
    if (!this.has(product.id)) {
      this.items.push(product);
      this.events.emit("cart:change");
    }
  }

  remove(productId: string): void {
    const index = this.items.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit("cart:change");
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit("cart:change");
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  has(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
