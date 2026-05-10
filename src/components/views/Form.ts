import { Component } from "../Component";

export abstract class Form<
  T extends Record<string, unknown>,
> extends Component<T> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.submitButton = this.container.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    )!;
    this.errorsContainer =
      this.container.querySelector<HTMLElement>(".form__errors")!;
  }

  set submitButtonState(isDisabled: boolean) {
    this.submitButton.disabled = isDisabled;
  }

  set errors(errorMessages: string[]) {
    this.errorsContainer.textContent = errorMessages.join("; ");
  }
}
