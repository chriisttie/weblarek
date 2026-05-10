import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";

export class FormContacts extends Form<Record<string, unknown>> {
  protected readonly emailInput: HTMLInputElement;
  protected readonly phoneInput: HTMLInputElement;
  private onChange?: (field: string, value: string) => void;
  private onSubmit?: () => void;

  constructor(
    container: HTMLElement,
    onChange?: (field: string, value: string) => void,
    onSubmit?: () => void,
  ) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
    this.onChange = onChange;
    this.onSubmit = onSubmit;
    this.emailInput.addEventListener("input", () => {
      this.onChange?.("email", this.emailInput.value);
    });
    this.phoneInput.addEventListener("input", () => {
      this.onChange?.("phone", this.phoneInput.value);
    });
    this.submitButton.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.onSubmit?.();
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
