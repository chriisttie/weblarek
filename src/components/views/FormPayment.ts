import { Form } from "./Form";
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../Events";

export class FormPayment extends Form<Partial<IBuyer>> {
  protected paymentButtons: NodeListOf<HTMLButtonElement>;

  private updateSubmitButtonState(): void {
    this.submitButtonState = false;
  }

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.updateSubmitButtonState();

    this.paymentButtons =
      this.container.querySelectorAll<HTMLButtonElement>(".button_type_radio");

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (event: MouseEvent) => {
        event.preventDefault();
        const payment = button.name as TPayment;
        this.setPayment(payment);

        this.events.emit("form:payment:change", { payment });
      });
    });

    this.submitButton.addEventListener("click", () => {
      const activeButton = this.container.querySelector<HTMLButtonElement>(
        ".button_type_radio.button_alt-active",
      );

      if (activeButton && activeButton.name) {
        const payment = activeButton.name as TPayment;
        this.events.emit("form:payment:submit", { payment });
      }
    });

    if (this.paymentButtons.length > 0) {
      this.setPayment(this.paymentButtons[0].name as TPayment);
    }
  }

  set payment(data: Partial<IBuyer>) {
    if (data.payment !== undefined && data.payment !== null) {
      this.setPayment(data.payment);
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
}
