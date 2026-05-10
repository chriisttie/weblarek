import { Form } from "./Form";
import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";

export class FormPayment extends Form<Record<string, unknown>> {
  protected readonly paymentButtons: NodeListOf<HTMLButtonElement>;
  protected readonly addressInput: HTMLInputElement;
  private onChange?: (field: string, value: string) => void;
  private onSubmit?: () => void;

  constructor(
    container: HTMLElement,
    onChange?: (field: string, value: string) => void,
    onSubmit?: () => void,
  ) {
    super(container);
    this.paymentButtons =
      this.container.querySelectorAll<HTMLButtonElement>(".button.button_alt");
    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );
    this.onChange = onChange;
    this.onSubmit = onSubmit;
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.onChange?.("payment", btn.name);
      });
    });
    this.addressInput.addEventListener("input", () => {
      this.onChange?.("address", this.addressInput.value);
    });
    this.submitButton.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.onSubmit?.();
    });
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((btn) => {
      const active = btn.name === value;
      btn.classList.toggle("button_alt-active", active);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
