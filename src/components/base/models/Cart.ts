import { IProduct } from "../../../types";

export class Cart {
  private _items: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this._items;
  }

  add(product: IProduct): void {
    this._items.push(product);
  }

  remove(productId: string): void {
    this._items = this._items.filter((item) => item.id !== productId);
  }

  clear(): void {
    this._items = [];
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
