// src/components/views/FormContacts.ts

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

    // Отправка формы
    this.submitButton.addEventListener("click", () => {
      const errors = this.validate();
      if (Object.keys(errors).length === 0) {
        this.events.emit("form:contacts:submit", this.getValues());
      } else {
        this.errors = errors;
      }
    });
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

  getValues(): Partial<IBuyer> {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
      address: this.addressInput.value,
    };
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const values = this.getValues();

    if (!values.email?.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!values.phone?.trim()) {
      errors.phone = "Укажите телефон";
    }
    if (!values.address?.trim()) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
