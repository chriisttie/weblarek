import { Card } from "./Card";
import { IProduct } from "../../../types";
import { CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

export class CardCart extends Card<IProduct & { id: string }> {
  private readonly removeButton: HTMLElement;
  private readonly indexElement: HTMLElement;
  private readonly image: HTMLImageElement | null;
  private onRemove?: () => void;

  constructor(container: HTMLElement, onRemove?: () => void) {
    super(container);
    this.removeButton = ensureElement<HTMLElement>(
      ".basket__item-delete",
      this.container,
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.image = this.container.querySelector<HTMLImageElement>(".card__image");
    this.onRemove = onRemove;
    this.removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onRemove?.();
    });
  }

  set product(data: IProduct & { id: string; index?: number }) {
    this.title = data.title;
    this.price = data.price;
    if (data.index !== undefined) {
      this.indexElement.textContent = String(data.index + 1);
    }
    if (this.image) {
      const imageName = data.image.startsWith("/")
        ? data.image.slice(1)
        : data.image;
      this.image.src = `${CDN_URL}${imageName}`;
      this.image.alt = data.title;
    }
  }
}
