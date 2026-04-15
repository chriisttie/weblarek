import { IProduct } from "../../../types";

export class Catalog {
  private _items: IProduct[] = [];
  private _previewProduct: IProduct | null = null;

  constructor(items: IProduct[] = []) {
    this._items = items;
  }

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreviewProduct(product: IProduct): void {
    this._previewProduct = product;
  }

  getPreviewProduct(): IProduct | null {
    return this._previewProduct;
  }
}
