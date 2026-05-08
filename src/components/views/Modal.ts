// src/components/views/Modal.ts

import { Component } from "../Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class Modal extends Component<Record<string, unknown>> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;
  private escapeHandler: (event: KeyboardEvent) => void;

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

    // Создаём обработчик Escape как метод класса
    this.escapeHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && this.isActive()) {
        this.close();
      }
    };

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
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
    // ✅ НЕ добавляем inline-стили — CSS сам управляет overflow
    document.addEventListener("keydown", this.escapeHandler);
  }

  close(): void {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.escapeHandler);
    this.content.replaceChildren();
    this.events.emit("modal:close");
  }

  isActive(): boolean {
    return this.container.classList.contains("modal_active");
  }
}
