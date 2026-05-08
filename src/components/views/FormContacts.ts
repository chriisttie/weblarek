import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class FormContacts extends Form<Partial<IBuyer>> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

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

    // ✅ Обработчики полей — ПРОВЕРЯЮТ валидность при вводе
    this.emailInput.addEventListener("input", () => {
      this.validateAndShowErrors();
      this.updateSubmitButtonState();
    });

    this.phoneInput.addEventListener("input", () => {
      this.validateAndShowErrors();
      this.updateSubmitButtonState();
    });

    // ✅ Изначальная валидация
    this.validateAndShowErrors();
    this.updateSubmitButtonState();

    // ✅ Обработчик кнопки "Оплатить"
    this.submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();

      const errors = this.validate();

      if (Object.keys(errors).length === 0) {
        this.events.emit("form:contacts:submit", this.getFormData());
      } else {
        this.errors = errors;
      }
    });
  }

  private getFormData(): Partial<IBuyer> {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  // ✅ ИСПРАВЛЕНО: добавлено имя параметра "data"
  set contacts(data: Partial<IBuyer>) {
    if (data.email !== undefined) this.emailInput.value = data.email;
    if (data.phone !== undefined) this.phoneInput.value = data.phone;
  }

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.clearErrors();
    const errorMessages = Object.values(errors).join("; ");
    this.errorsContainer.textContent = errorMessages;
  }

  private updateSubmitButtonState(): void {
    const emailFilled = this.emailInput.value.trim() !== "";
    const phoneFilled = this.phoneInput.value.trim() !== "";

    this.submitButtonState = !(emailFilled && phoneFilled);
  }

  private validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.emailInput.value.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phoneInput.value.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }

  private validateAndShowErrors(): void {
    const errors = this.validate();

    if (Object.keys(errors).length > 0) {
      this.errors = errors;
    } else {
      this.clearErrors();
    }
  }

  protected clearErrors(): void {
    this.errorsContainer.textContent = "";
  }
}
