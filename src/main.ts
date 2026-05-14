import "./scss/styles.scss";
import { EventEmitter } from "./components/Events";
import { Catalog } from "./components/models/Catalog";
import { Cart } from "./components/models/Cart";
import { Customer } from "./components/models/Customer";
import { ApiLarek } from "./components/models/ApiLarek";
import { Api } from "./components/Api";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardCart } from "./components/views/Card/CardCart";
import { CardProductFull } from "./components/views/Card/CardProductFull";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { FormContacts } from "./components/views/FormContacts";
import { FormPayment } from "./components/views/FormPayment";
import { OrderSuccess } from "./components/views/Order";
import { IProduct, IProductsResponse, IBuyer } from "./types";
import { API_URL } from "./utils/constants";

const events = new EventEmitter();
const catalog = new Catalog(events);
const cart = new Cart(events);
const customer = new Customer(events);
const api = new Api(API_URL);
const apiLarek = new ApiLarek(api);

const header = new Header(events, document.querySelector(".header")!);
const gallery = new Gallery(document.querySelector(".gallery")!);
const modal = new Modal(events, document.querySelector(".modal")!);

const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketClone = basketTemplate.content.cloneNode(true) as DocumentFragment;
const basketContainer = basketClone.querySelector(".basket") as HTMLElement;
const basket = new Basket(events, basketContainer);

const productFullTemplate = document.getElementById(
  "card-preview",
) as HTMLTemplateElement;
const productFullClone = productFullTemplate.content.cloneNode(
  true,
) as DocumentFragment;
const productFullContainer = productFullClone.querySelector(
  ".card",
) as HTMLElement;
const productFull = new CardProductFull(productFullContainer, () =>
  events.emit("product:add"),
);

const paymentTemplate = document.getElementById("order") as HTMLTemplateElement;
const contactsTemplate = document.getElementById(
  "contacts",
) as HTMLTemplateElement;

const formPayment = new FormPayment(
  paymentTemplate.content.querySelector("form")! as HTMLElement,
  (field, value) => events.emit("form:payment:change", { field, value }),
  () => events.emit("form:payment:submit"),
);

const formContacts = new FormContacts(
  contactsTemplate.content.querySelector("form")! as HTMLElement,
  (field, value) => events.emit("form:contacts:change", { field, value }),
  () => events.emit("form:contacts:submit"),
);

const successTemplate = document.getElementById(
  "success",
) as HTMLTemplateElement;
const successClone = successTemplate.content.cloneNode(
  true,
) as DocumentFragment;
const successContainer = successClone.querySelector(
  ".order-success",
) as HTMLElement;
const orderSuccess = new OrderSuccess(events, successContainer);

events.on("catalog:change", ({ items }: { items: IProduct[] }) => {
  const cards = items.map((product) => {
    const template = document.getElementById(
      "card-catalog",
    ) as HTMLTemplateElement;
    const el = template.content.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(
      el.querySelector("button")! as HTMLElement,
      () => events.emit("product:select", { id: product.id }),
    );
    card.product = product;
    return card.render();
  });
  gallery.catalog = cards;
});

events.on("product:select", ({ id }: { id: string }) => {
  const product = catalog.getItemById(id);
  if (product) {
    catalog.setPreviewProduct(product);
    const previewProduct = catalog.getPreviewProduct();
    if (previewProduct) {
      productFull.product = previewProduct;
      const isInCart = cart.has(previewProduct.id);
      productFull.setButtonText(isInCart ? "Удалить из корзины" : "Купить");
      modal.setContent(productFull.render());
      modal.open();
    }
  }
});

events.on("product:add", () => {
  const product = catalog.getPreviewProduct();
  if (!product) return;
  if (cart.has(product.id)) {
    cart.remove(product.id);
  } else {
    cart.add(product);
  }
});

events.on("basket:open", () => {
  modal.setContent(basket.render());
  modal.open();
});

events.on("cart:change", () => {
  header.counter = cart.getCount();

  const cartItemsElements = cart.getItems().map((product, index) => {
    const template = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement;
    const el = template.content.cloneNode(true) as HTMLElement;
    const card = new CardCart(el.querySelector("li")! as HTMLElement, () =>
      events.emit("cart:item:remove", { id: product.id }),
    );
    card.product = { ...product, index };
    return card.render();
  });

  basket.items = cartItemsElements;
  basket.total = cart.getTotalPrice();
  basket.orderDisabled = cartItemsElements.length === 0;

  if (modal.isActive()) {
    const previewProduct = catalog.getPreviewProduct();
    if (previewProduct) {
      const isInCart = cart.has(previewProduct.id);
      productFull.setButtonText(isInCart ? "Удалить из корзины" : "Купить");
    }
  }
});

events.on("cart:item:remove", ({ id }: { id: string }) => {
  cart.remove(id);
});

events.on("basket:order", () => {
  modal.setContent(formPayment.render());
});

events.on("customer:change", () => {
  const errors = customer.validate();
  const paymentErrors = [errors.payment, errors.address].filter(
    Boolean,
  ) as string[];
  formPayment.errors = paymentErrors;
  formPayment.submitButtonState = !customer.isPaymentFormValid;
  const contactsErrors = [errors.email, errors.phone].filter(
    Boolean,
  ) as string[];
  formContacts.errors = contactsErrors;
  formContacts.submitButtonState = !customer.isContactsFormValid;
  formPayment.payment = customer.get().payment;
  formPayment.address = customer.get().address;
  formContacts.email = customer.get().email;
  formContacts.phone = customer.get().phone;
});

events.on(
  "form:payment:change",
  ({ field, value }: { field: string; value: string }) => {
    customer.set({ [field]: value } as Partial<IBuyer>);
  },
);

events.on("form:payment:submit", () => {
  if (customer.isPaymentFormValid) {
    modal.setContent(formContacts.render());
  }
});

events.on(
  "form:contacts:change",
  ({ field, value }: { field: string; value: string }) => {
    customer.set({ [field]: value } as Partial<IBuyer>);
  },
);

events.on("form:contacts:submit", () => {
  const errors = customer.validate();
  const contactsErrors = [errors.email, errors.phone].filter(
    Boolean,
  ) as string[];
  if (contactsErrors.length > 0) {
    formContacts.errors = contactsErrors;
    formContacts.submitButtonState = true;
    return;
  }
  const order = {
    ...customer.get(),
    total: cart.getTotalPrice(),
    items: cart.getItems().map((i) => i.id),
  };
  apiLarek.createOrder(order).then((response) => {
    orderSuccess.total = response.total;
    modal.setContent(orderSuccess.render());
    cart.clear();
    customer.clear();
  });
});

events.on("order:success:close", () => {
  modal.close();
});

apiLarek.getProducts().then((res: IProductsResponse) => {
  catalog.setItems(res.items);
});
