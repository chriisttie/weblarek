import { CardWithImage } from "./CardWithImage";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class ProductFull extends CardWithImage<IProduct> {
  protected readonly description: HTMLElement;
  private onAction?: () => void;
  private isButtonDisabledForPrice = false;

  constructor(container: HTMLElement, onAction?: () => void) {
    super(container);
    this.description = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.onAction = onAction;
    this.button?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onAction?.();
    });
  }

  set product(data: IProduct) {
    this.title = data.title;
    this.price = data.price;
    this.setProductCategory(data.category);
    this.setProductImage(data.image, data.title);
    this.description.textContent = data.description;
    this.container.dataset.id = data.id;
    if (data.price === null) {
      this.isButtonDisabledForPrice = true;
      this.buttonState = true;
      this.buttonText = "Недоступно";
    }
  }

  setButtonText(text: string) {
    if (!this.isButtonDisabledForPrice && this.button) {
      this.button.textContent = text;
    }
  }
}
