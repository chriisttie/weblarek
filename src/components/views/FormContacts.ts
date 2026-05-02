//formcon

import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class FormContacts extends Form<Partial<IBuyer>> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected addressInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
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
    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );

    const inputs = [this.emailInput, this.phoneInput, this.addressInput];
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.clearErrors();
        this.updateSubmitButtonState();
      });
    });

    this.updateSubmitButtonState();

    this.submitButton.addEventListener("click", () => {
      this.events.emit("form:contacts:submit", this.getFormData());
    });
  }

  private getFormData(): Partial<IBuyer> {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
      address: this.addressInput.value,
    };
  }

  set contacts(data: Partial<IBuyer>) {
    if (data.email !== undefined) this.emailInput.value = data.email;
    if (data.phone !== undefined) this.phoneInput.value = data.phone;
    if (data.address !== undefined) this.addressInput.value = data.address;
  }

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.clearErrors();
    Object.entries(errors).forEach(([field, message]) => {
      const errorElement = this.container.querySelector<HTMLElement>(
        `.form__error[data-field="${field}"]`,
      );
      if (errorElement) {
        errorElement.textContent = message;
      }
    });
  }

  private updateSubmitButtonState(): void {
    const values = this.getFormData();
    const hasErrors =
      !values.email?.trim() || !values.phone?.trim() || !values.address?.trim();

    this.submitButtonState = hasErrors;
  }
}
