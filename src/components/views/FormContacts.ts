import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class FormContacts extends Form<Partial<IBuyer>> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  // ✅ УДАЛЕНО: addressInput (его нет в template #contacts!)

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
    // ✅ УДАЛЕНО: this.addressInput

    // ✅ Только email и phone
    const inputs = [this.emailInput, this.phoneInput];
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.clearErrors();
        this.updateSubmitButtonState();
      });
    });

    this.updateSubmitButtonState();

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
      // ✅ УДАЛЕНО: address (его нет в этой форме)
    };
  }

  set contacts(data: Partial<IBuyer>) {
    if (data.email !== undefined) this.emailInput.value = data.email;
    if (data.phone !== undefined) this.phoneInput.value = data.phone;
    // ✅ УДАЛЕНО: address
  }

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.clearErrors();
    const errorMessages = Object.values(errors).join("; ");
    this.errorsContainer.textContent = errorMessages;
  }

  private updateSubmitButtonState(): void {
    const values = this.getFormData();
    // ✅ Только email и phone для валидации
    const hasErrors = !values.email?.trim() || !values.phone?.trim();

    this.submitButtonState = hasErrors;
  }

  private validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const values = this.getFormData();

    if (!values.email?.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!values.phone?.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }

  protected clearErrors(): void {
    this.errorsContainer.textContent = "";
  }
}
