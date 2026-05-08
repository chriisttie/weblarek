import { Component } from "../../Component";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, categoryNames } from "../../../utils/constants";

export class Card<T extends IProduct> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;
  protected readonly categoryElement: HTMLElement | null;
  protected readonly button: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );

    this.categoryElement =
      this.container.querySelector<HTMLElement>(".card__category");

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

  set category(value: string) {
    if (!this.categoryElement) {
      return;
    }

    const className = categoryMap[value as keyof typeof categoryMap];
    const categoryName =
      categoryNames[value as keyof typeof categoryNames] || value;

    this.categoryElement.textContent = categoryName;

    if (className) {
      this.categoryElement.className = `card__category ${className}`;
    } else {
      this.categoryElement.className = "card__category";
    }
  }

  set buttonState(isDisabled: boolean) {
    if (this.button) {
      this.button.disabled = isDisabled;
    }
  }
}
