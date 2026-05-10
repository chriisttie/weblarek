import { Component } from "../../Component";

export abstract class Card<T> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;
  protected readonly button: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement =
      this.container.querySelector<HTMLElement>(".card__title")!;
    this.priceElement =
      this.container.querySelector<HTMLElement>(".card__price")!;
    this.button =
      this.container.querySelector<HTMLButtonElement>(".card__button");
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  set buttonState(isDisabled: boolean) {
    if (this.button) {
      this.button.disabled = isDisabled;
    }
  }

  set buttonText(text: string) {
    if (this.button) {
      this.button.textContent = text;
    }
  }
}
