// src/components/views/Modal.ts

import { Component } from "../Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class Modal extends Component<Record<string, unknown>> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.content = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    // Закрытие по клику на крестик
    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    // Закрытие по клику на overlay
    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
        this.close();
      }
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && this.isActive()) {
        this.close();
      }
    });
  }

  set contentElement(content: HTMLElement) {
    this.content.replaceChildren(content);
  }

  open(): void {
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close(): void {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";
    this.content.replaceChildren();
    this.events.emit("modal:close");
  }

  isActive(): boolean {
    return this.container.classList.contains("modal_active");
  }
}
