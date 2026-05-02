//cardPF

import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class ProductFull extends Card<IProduct> {
  protected image: HTMLImageElement;
  protected description: HTMLElement;

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
      ".card__description",
      this.container,
    );

    if (this.button) {
      this.button.addEventListener("click", (event: MouseEvent) => {
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
    this.image.src = data.image;
    this.image.alt = data.title;
    this.description.textContent = data.description;
    this.container.dataset.id = data.id;
  }
}
