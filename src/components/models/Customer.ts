import { EventEmitter } from "../Events";
import { IBuyer, IBuyerErrors, TPayment } from "../../types";

export class Customer {
  private payment: TPayment | null = null;
  private email = "";
  private phone = "";
  private address = "";

  constructor(private events: EventEmitter) {}

  set(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit("customer:change");
  }

  get(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear() {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("customer:change");
  }

  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address.trim()) {
      errors.address = "Необходимо указать адрес";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    return errors;
  }

  get isPaymentFormValid(): boolean {
    return this.payment !== null && this.address.trim() !== "";
  }

  get isContactsFormValid(): boolean {
    return this.email.trim() !== "" && this.phone.trim() !== "";
  }
}
