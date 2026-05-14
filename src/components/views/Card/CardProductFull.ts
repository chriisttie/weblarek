import { CardWithImage } from "./CardWithImage";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class CardProductFull extends CardWithImage<IProduct> {
  protected readonly description: HTMLElement;
  protected readonly button: HTMLButtonElement | null;
  private isButtonDisabledForPrice = false;
  private onAction?: () => void;

  constructor(container: HTMLElement, onAction?: () => void) {
    super(container);
    this.description = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.button =
      this.container.querySelector<HTMLButtonElement>(".card__button");
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
    if (data.price === null) {
      this.isButtonDisabledForPrice = true;
      this.buttonState = true;
      this.setButtonText("Недоступно"); 
    }
  }

  set buttonState(isDisabled: boolean) {
    if (this.button) {
      this.button.disabled = isDisabled;
    }
  }

  setButtonText(text: string) {
    if (!this.isButtonDisabledForPrice && this.button) {
      this.button.textContent = text;
    }
  }
}
