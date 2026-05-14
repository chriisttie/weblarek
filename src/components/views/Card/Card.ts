import { Component } from "../../Component";

export abstract class Card<T> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement =
      this.container.querySelector<HTMLElement>(".card__title")!;
    this.priceElement =
      this.container.querySelector<HTMLElement>(".card__price")!;
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
}
