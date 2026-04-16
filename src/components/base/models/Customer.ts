import { IBuyer, TPayment } from "../../../types";

export class Customer {
  private _payment: TPayment = "card";
  private _email: string = "";
  private _phone: string = "";
  private _address: string = "";

  constructor() {}

  set(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
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
    this._payment = "card";
    this._email = "";
    this._phone = "";
    this._address = "";
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._email) {
      errors.email = "Укажите емэйл";
    }
    if (!this._phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this._address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
