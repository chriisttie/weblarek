// src/components/views/CardCatalog.ts

import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class CardCatalog extends Card<IProduct> {
  protected readonly image: HTMLImageElement;
  private productData: IProduct | null = null;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    // Клик на всю карточку - открытие деталей
    this.container.addEventListener("click", (event: MouseEvent) => {
      if (!(event.target instanceof HTMLButtonElement) && this.productData) {
        this.events.emit("product:select", { product: this.productData });
      }
    });

    // Клик на кнопку покупки
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
  }
}
