import { Component } from "../Component";
import { IOrderResponse } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../Events";

export class OrderSuccess extends Component<IOrderResponse> {
  protected message: HTMLElement;
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

   
    this.message = ensureElement<HTMLElement>(
      ".order-success__title",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("order:success:close");
    });
  }

  set order(data: IOrderResponse) {
    this.message.textContent = "Заказ оформлен!";
    this.totalElement.textContent = `Списано ${data.total} синапсов`;
  }
}