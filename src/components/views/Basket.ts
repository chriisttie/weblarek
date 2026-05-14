import { Component } from "../Component";
import { EventEmitter } from "../Events";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<Record<string, unknown>> {
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
    this.orderButton.disabled = true;
    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: HTMLElement[]) {
    this.list.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set orderDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
