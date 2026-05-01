//form

import { Component } from "../Component";
import { ensureElement } from "../../utils/utils";

export class Form<T extends Record<string, unknown>> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.submitButton = container.querySelector('.button[type="submit"]')!;
    this.errorsContainer = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
  }

  protected clearErrors(): void {
    const errorElements =
      this.container.querySelectorAll<HTMLElement>(".form__error");
    errorElements.forEach((el) => {
      el.textContent = "";
    });
  }

  set submitButtonState(isDisabled: boolean) {
    this.submitButton.disabled = isDisabled;
  }
}
