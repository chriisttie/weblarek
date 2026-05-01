import { IProduct } from "../../types";
import { IEvents } from "../Events";

export class Catalog {
  private _items: IProduct[] = [];
  private _previewProduct: IProduct | null = null;

  constructor(
    protected events: IEvents,
    items: IProduct[] = [],
  ) {
    this._items = items;
  }

  setItems(items: IProduct[]): void {
    this._items = items;

    this.events.emit("catalog:change", { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreviewProduct(product: IProduct): void {
    this._previewProduct = product;

    this.events.emit("product:preview", { product: this._previewProduct });
  }

  getPreviewProduct(): IProduct | null {
    return this._previewProduct;
  }
}
