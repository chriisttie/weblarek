import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../Events";
import { CDN_URL } from "../../../utils/constants";

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

    // ✅ Клик на карточку открывает превью
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
    this.image.src = CDN_URL + data.image;
    this.image.alt = data.title;

    this.container.dataset.id = data.id;

    // ✅ НЕ блокируем всю карточку — только цена отображается как "Бесценно"
    // (это уже обрабатывается в базовом классе Card.set price)
  }
}
