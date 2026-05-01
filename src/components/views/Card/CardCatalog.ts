//cardcat

import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class CardCatalog extends Card<IProduct> {
  protected readonly image: HTMLImageElement;
  private productData: IProduct | null = null; // Реальные данные хранятся в модели Catalog

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", (event: MouseEvent) => {
      const clickedOnButton = this.button?.contains(event.target as Node);
      if (!clickedOnButton && this.productData) {
        this.events.emit("product:select", { product: this.productData });
      }
    });

    if (this.button) {
      this.button.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        if (this.productData) {
          this.events.emit("product:add", { product: this.productData });
        }
      });
    }
  }

  set product(data: IProduct) {
    this.productData = data;
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.image.src = data.image;
    this.image.alt = data.title;

    this.updateButtonState();

    if (data.price === null) {
      this.buttonState = true;
      if (this.button) {
        this.button.textContent = "Недоступно";
      }
    } else {
      this.updateButtonState();
    }
  }

  private updateButtonState(): void {
    if (!this.button) return;

    const isInCart = false;

    if (isInCart) {
      this.button.textContent = "Удалить из корзины";
      this.button.classList.add("card__button_active");
    } else {
      this.button.textContent = "Купить";
      this.button.classList.remove("card__button_active");
    }
  }
}
