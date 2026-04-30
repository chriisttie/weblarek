import { IProduct } from "../../../types";

export class Catalog {
  private items: IProduct[] = [];
  private previewProduct: IProduct | null = null;

  constructor(items: IProduct[] = []) {
    this.items = items;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreviewProduct(product: IProduct): void {
    this.previewProduct = product;
  }

  getPreviewProduct(): IProduct | null {
    return this.previewProduct;
  }
}
