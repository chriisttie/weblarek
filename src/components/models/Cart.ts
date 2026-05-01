import { IProduct } from "../../types";
import { IEvents } from "../Events";

export class Cart {
  private _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  add(product: IProduct): void {
    this._items.push(product);

    this.events.emit("cart:change", { items: this._items });
  }

  remove(productId: string): void {
    this._items = this._items.filter((item) => item.id !== productId);

    this.events.emit("cart:change", { items: this._items });
  }

  clear(): void {
    this._items = [];

    this.events.emit("cart:change", { items: this._items });
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  has(productId: string): boolean {
    return this._items.some((item) => item.id === productId);
  }
}
