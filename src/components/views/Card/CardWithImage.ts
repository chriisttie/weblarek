import { Card } from "./Card";
import { CDN_URL, categoryMap, categoryNames } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

export abstract class CardWithImage<T> extends Card<T> {
  protected readonly image: HTMLImageElement;
  protected readonly categoryElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement =
      this.container.querySelector<HTMLElement>(".card__category");
  }

  protected setProductImage(imagePath: string, alt: string) {
    const cleanPath = imagePath.replace(/^\/+/, "");
    const fullUrl = `${CDN_URL}${cleanPath}`;
    this.image.src = fullUrl;
    this.image.alt = alt;
  }

  protected setProductCategory(value: string) {
    if (!this.categoryElement) return;
    const modifier = categoryMap[value as keyof typeof categoryMap];
    const name = categoryNames[value as keyof typeof categoryNames] || value;
    this.categoryElement.textContent = name;
    if (modifier) {
      this.categoryElement.className = "card__category";
      this.categoryElement.classList.add(modifier);
    }
  }
}
