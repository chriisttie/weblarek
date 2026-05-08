import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class ProductFull extends Card<IProduct> {
  protected readonly image: HTMLImageElement;
  protected readonly description: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.description = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    if (this.button) {
      this.button.addEventListener("click", (event: Event) => {
        event.stopPropagation();
        const productId = this.container.dataset.id;
        if (productId) {
          this.events.emit("product:add", { productId });
        }
      });
    }
  }

  set product(data: IProduct) {
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;

    this.description.textContent = data.description;

    this.container.dataset.id = data.id;

    if (data.price === null) {
      this.buttonState = true;
      if (this.button) {
        this.button.textContent = "Недоступно";
      }
    }
  }

  updateButtonText(isInCart: boolean): void {
    if (this.button && this.button.textContent !== "Недоступно") {
      this.button.textContent = isInCart ? "Удалить из корзины" : "Купить";
    }
  }

  getProductId(): string | undefined {
    return this.container.dataset.id;
  }
}
