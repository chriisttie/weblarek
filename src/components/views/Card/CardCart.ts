//cardcart

import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class CardCart extends Card<IProduct> {
  protected readonly image: HTMLImageElement;
  protected readonly removeButton: HTMLButtonElement;
  private productId: string = "";

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>(
      ".cart-item__image",
      this.container,
    );
    this.removeButton = ensureElement<HTMLButtonElement>(
      ".cart-item__delete",
      this.container,
    );

    this.removeButton.addEventListener("click", () => {
      this.events.emit("cart:item:remove", { productId: this.productId });
    });
  }

  set product(data: IProduct & { id: string }) {
    this.productId = data.id;
    this.title = data.title;
    this.price = data.price;
    this.image.src = data.image;
    this.image.alt = data.title;
  }
}
