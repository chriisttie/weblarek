// src/components/views/FormPayment.ts

import { Form } from "./Form";
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../Events";

export class FormPayment extends Form<Partial<IBuyer>> {
  protected readonly paymentButtons: NodeListOf<HTMLButtonElement>;
  private selectedPayment: TPayment = "card";

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

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
      this.events.emit("form:payment:submit", {
        payment: this.selectedPayment,
      });
    });

    this.setPayment("card");
  }

  set payment(data: Partial<IBuyer>) {
    if (data.payment !== undefined && data.payment !== null) {
      this.setPayment(data.payment);
    }
  }

  private setPayment(payment: TPayment): void {
    this.selectedPayment = payment;

    this.paymentButtons.forEach((button) => {
      if (button.name === payment) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }
}
