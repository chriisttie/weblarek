import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../Events";

export class Customer {
  private _payment: TPayment | null = null;
  private _email: string = "";
  private _phone: string = "";
  private _address: string = "";

  constructor(protected events: IEvents) {}

  set(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this._payment = data.payment ?? null;
    }
    if (data.email !== undefined) {
      this._email = data.email;
    }
    if (data.phone !== undefined) {
      this._phone = data.phone;
    }
    if (data.address !== undefined) {
      this._address = data.address;
    }

    this.events.emit("customer:change", this.get());
  }

  get(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";

    this.events.emit("customer:change", this.get());
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (this._payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._email.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!this._phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    if (!this._address.trim()) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
