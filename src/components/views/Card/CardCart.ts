import { Card } from "./Card";
import { IProduct } from "../../../types";
import { IEvents } from "../../Events";

export class CardCart extends Card<IProduct> {
  protected readonly image: HTMLImageElement | null;
  protected readonly removeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = this.container.querySelector<HTMLImageElement>(".card__image");

    this.removeButton = this.container.querySelector<HTMLButtonElement>(
      ".basket__item-delete",
    )!;

    this.removeButton.addEventListener("click", (event: Event) => {
      event.stopPropagation();
      const productId = this.container.dataset.id;
      if (productId) {
        this.events.emit("cart:item:remove", { productId });
      }
    });
  }

  set product(data: IProduct & { id: string }) {
    this.title = data.title;
    this.price = data.price;

    this.container.dataset.id = data.id;
  }
}
