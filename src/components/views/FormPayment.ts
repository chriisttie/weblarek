import { Form } from "./Form";
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../Events";
import { ensureElement } from "../../utils/utils";

export class FormPayment extends Form<Partial<IBuyer>> {
  protected readonly paymentButtons: NodeListOf<HTMLButtonElement>;
  protected readonly addressInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.paymentButtons =
      this.container.querySelectorAll<HTMLButtonElement>(".button.button_alt");

    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );

    // ✅ Обработчики кнопок оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (event: Event) => {
        event.preventDefault();
        const payment = (event.target as HTMLButtonElement).name as TPayment;
        this.setPayment(payment);
        this.updateSubmitButtonState();
        this.validateAndShowErrors();
        this.events.emit("form:payment:change", { payment });
      });
    });

    // ✅ Обработчик поля адреса
    this.addressInput.addEventListener("input", () => {
      this.clearErrors();
      this.updateSubmitButtonState();
      this.validateAndShowErrors();
    });

    // ✅ Обработчик кнопки "Далее"
    this.submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();

      const errors = this.validate();

      if (Object.keys(errors).length === 0) {
        const activeButton = this.container.querySelector<HTMLButtonElement>(
          ".button.button_alt.button_alt-active",
        );

        if (activeButton && activeButton.name) {
          const payment = activeButton.name as TPayment;
          this.events.emit("form:payment:submit", {
            payment,
            address: this.addressInput.value,
          });
        }
      } else {
        this.errors = errors;
      }
    });

    // ✅ Изначально НИ ОДНА кнопка не выбрана
    this.updateSubmitButtonState();
    this.validateAndShowErrors();
  }

  // ✅ ИСПРАВЛЕНО: "data:" перед типом
  set payment(data: Partial<IBuyer>) {
    if (data.payment !== undefined && data.payment !== null) {
      this.setPayment(data.payment);
    }
    if (data.address !== undefined) {
      this.addressInput.value = data.address;
    }
  }

  private setPayment(payment: TPayment): void {
    this.paymentButtons.forEach((button) => {
      if (button.name === payment) {
        button.classList.add("button_alt-active");
        button.dataset.selected = "true";
      } else {
        button.classList.remove("button_alt-active");
        button.dataset.selected = "false";
      }
    });
  }

  private updateSubmitButtonState(): void {
    const activeButton = this.container.querySelector(".button_alt-active");
    const hasAddress = this.addressInput.value.trim() !== "";
    this.submitButtonState = !(activeButton && hasAddress);
  }

  private validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    const activeButton = this.container.querySelector(".button_alt-active");
    if (!activeButton) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.addressInput.value.trim()) {
      errors.address = "Необходимо указать адрес";
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

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.clearErrors();
    const errorMessages = Object.values(errors).join("; ");
    this.errorsContainer.textContent = errorMessages;
  }

  protected clearErrors(): void {
    this.errorsContainer.textContent = "";
  }
}
