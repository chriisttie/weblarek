import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class CardCart extends Card<IProduct> {
  protected image: HTMLImageElement;
  protected removeButton: HTMLButtonElement;

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
      const productId = this.container.dataset.id;
      if (productId) {
        this.events.emit("cart:item:remove", { productId });
      }
    });
  }

  set product(data: IProduct & { id: string }) {
    this.title = data.title;
    this.price = data.price;
    this.image.src = data.image;
    this.image.alt = data.title;

    this.container.dataset.id = data.id;
  }
}
