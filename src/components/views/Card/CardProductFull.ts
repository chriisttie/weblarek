//cardPF

import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class ProductFull extends Card<IProduct> {
  protected readonly image: HTMLImageElement;
  protected readonly description: HTMLElement;
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
    this.description = ensureElement<HTMLElement>(
      ".card__description",
      this.container,
    );

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
    this.description.textContent = data.description;
  }
}
