import { Component } from "../Component";
import { EventEmitter } from "../Events";
import { ensureElement } from "../../utils/utils";

export class OrderSuccess extends Component<{ total: number }> {
  protected readonly totalElement: HTMLElement;
  protected readonly closeButton: HTMLButtonElement;

  constructor(
    private events: EventEmitter,
    container: HTMLElement,
  ) {
    super(container);
    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.closeButton.addEventListener("click", () => {
      this.events.emit("order:success:close");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
