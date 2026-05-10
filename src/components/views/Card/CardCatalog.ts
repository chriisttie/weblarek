import { CardWithImage } from "./CardWithImage";
import { IProduct } from "../../../types";

export class CardCatalog extends CardWithImage<IProduct> {
  private onSelect?: (id: string) => void;

  constructor(container: HTMLElement, onSelect?: (id: string) => void) {
    super(container);
    this.onSelect = onSelect;
    this.container.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.onSelect?.(id);
    });
  }

  set product(data: IProduct) {
    this.title = data.title;
    this.price = data.price;
    this.setProductCategory(data.category);
    this.setProductImage(data.image, data.title);
    this.container.dataset.id = data.id;
    if (this.button) {
      this.button.style.display = "none";
    }
    if (data.price === null) {
      this.buttonState = true;
    }
  }
}
