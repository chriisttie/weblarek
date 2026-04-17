import { IProduct } from "../../../types";

export class Cart {
  private items: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    this.items.push(product);
  }

  remove(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
