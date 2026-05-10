import { Component } from "../Component";
import { EventEmitter } from "../Events";
import { CardCart } from "./Card/CardCart";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<{ items: IProduct[]; total: number }> {
  protected readonly list: HTMLElement;
  protected readonly priceElement: HTMLElement;
  protected readonly orderButton: HTMLButtonElement;

  constructor(
    private events: EventEmitter,
    container: HTMLElement,
  ) {
    super(container);
    this.list = ensureElement<HTMLElement>(".basket__list", this.container);
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: IProduct[]) {
    this.list.innerHTML = "";
    if (items.length === 0) {
      return;
    }
    items.forEach((product, index) => {
      const template = document.getElementById(
        "card-basket",
      ) as HTMLTemplateElement;
      const el = template.content.cloneNode(true) as HTMLElement;
      const card = new CardCart(el.querySelector("li")! as HTMLElement, (id) =>
        this.events.emit("cart:item:remove", { id }),
      );
      card.product = { ...product, index };
      this.list.appendChild(card.render());
    });
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set orderDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
