import { Component } from "../Component";
import { EventEmitter } from "../Events";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<Record<string, unknown>> {
  public readonly content: HTMLElement;
  protected readonly closeButton: HTMLButtonElement;
  private escapeHandler: (event: KeyboardEvent) => void;

  constructor(
    private events: EventEmitter,
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

  setContent(content: HTMLElement): void {
    this.content.replaceChildren(content);
  }

  open(): void {
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
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

  isBasketContent(): boolean {
    return this.content.querySelector(".basket") !== null;
  }

  setBasketContent(): void {
    this.events.emit("cart:change");
  }
}
