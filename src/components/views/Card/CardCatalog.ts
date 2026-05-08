import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";

export class CardCatalog extends Card<IProduct> {
  protected readonly image: HTMLImageElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", (event: Event) => {
      if (
        !this.container
          .querySelector(".basket__item-delete")
          ?.contains(event.target as Node)
      ) {
        const productId = this.container.dataset.id;
        if (productId) {
          this.events.emit("product:select", { productId });
        }
      }
    });
  }

  set product(data: IProduct) {
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;

    this.container.dataset.id = data.id;

    if (data.price === null) {
      this.buttonState = true;
      if (this.button) {
        this.button.textContent = "Недоступно";
      }
    }
  }
}
