// src/components/views/Gallery.ts

import { Component } from "../Component";
import { ensureElement } from "../../utils/utils";

interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container,
    );
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
