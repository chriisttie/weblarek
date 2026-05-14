import { CardWithImage } from "./CardWithImage";
import { IProduct } from "../../../types";

export class CardCatalog extends CardWithImage<IProduct> {
  private onSelect?: () => void;

  constructor(container: HTMLElement, onSelect?: () => void) {
    super(container);
    this.onSelect = onSelect;
    this.container.addEventListener("click", () => {
      this.onSelect?.();
    });
  }

  set product(data: IProduct) {
    this.title = data.title;
    this.price = data.price;
    this.setProductCategory(data.category);
    this.setProductImage(data.image, data.title);
    const button =
      this.container.querySelector<HTMLButtonElement>(".card__button");
    if (button) {
      button.style.display = "none";
    }
  }
}
