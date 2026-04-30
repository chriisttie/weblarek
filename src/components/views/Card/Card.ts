// src/components/views/Card/Card.ts

import { Component } from "../../Component";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export class Card<T extends IProduct> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected button: HTMLButtonElement | null;

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
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.button = this.container.querySelector(".card__button");
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
    const categoryText =
      categoryMap[value as keyof typeof categoryMap] || value;
    this.categoryElement.textContent = categoryText;
    this.categoryElement.className = `card__category card__category_${value}`;
  }

  set buttonState(isDisabled: boolean) {
    if (this.button) {
      this.button.disabled = isDisabled;
    }
  }
}
