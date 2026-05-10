import { ensureElement } from "../../utils/utils";
import { Component } from "../Component";
import { EventEmitter } from "../Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected readonly counterElement: HTMLElement;
  protected readonly basketButton: HTMLButtonElement;

  constructor(
    private events: EventEmitter,
    container: HTMLElement,
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
