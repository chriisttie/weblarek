//main

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
import { ProductFull } from "./components/views/Card/CardProductFull";
import { Modal } from "./components/views/Modal";
import { FormContacts } from "./components/views/FormContacts";
import { FormPayment } from "./components/views/FormPayment";
import { OrderSuccess } from "./components/views/Order";

import { IProduct, IProductsResponse, IBuyer, TPayment } from "./types";
import { API_URL } from "./utils/constants";

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

const events = new EventEmitter();

const catalog = new Catalog(events);
const cart = new Cart(events);
const customer = new Customer(events);

const api = new Api(API_URL);
const apiLarek = new ApiLarek(api);

// ============================================
// ПРЕДСТАВЛЕНИЯ (VIEW)
// ============================================

const header = new Header(events, document.querySelector(".header")!);
const gallery = new Gallery(document.querySelector(".gallery")!);
const modal = new Modal(events, document.querySelector(".modal")!);
const formContacts = new FormContacts(
  events,
  document.querySelector(".contacts")!,
);
const formPayment = new FormPayment(
  events,
  document.querySelector(".payment")!,
);

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ (PRESENTER)
// ============================================

//Каталог товаров

events.on("catalog:change", ({ items }: { items: IProduct[] }) => {
  const cards = items.map((product: IProduct) => {
    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <div class="card">
        <img class="card__image" src="" alt="">
        <h2 class="card__title"></h2>
        <p class="card__price"></p>
        <span class="card__category"></span>
        <button class="card__button">Купить</button>
      </div>
    `;
    const card = new CardCatalog(
      events,
      cardContainer.firstElementChild as HTMLElement,
    );
    card.product = product;
    return card.render();
  });
  gallery.catalog = cards;
});

events.on("product:select", ({ productId }: { productId: string }) => {
  const product = catalog.getItemById(productId);
  if (product) {
    catalog.setPreviewProduct(product);
  }
});

events.on("product:preview", ({ product }: { product: IProduct }) => {
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = `
    <div class="card">
      <img class="card__image" src="" alt="">
      <h2 class="card__title"></h2>
      <p class="card__price"></p>
      <span class="card__category"></span>
      <p class="card__description"></p>
      <button class="card__button">Купить</button>
    </div>
  `;
  const productFull = new ProductFull(
    events,
    modalContainer.firstElementChild as HTMLElement,
  );
  productFull.product = product;
  modal.contentElement = productFull.render();
  modal.open();
});

events.on("product:add", ({ productId }: { productId: string }) => {
  const product = catalog.getItemById(productId);
  if (product) {
    cart.add(product);
    modal.close();
  }
});

// Корзина

events.on("cart:change", () => {
  header.counter = cart.getCount();

  const currentItems = catalog.getItems();
  const cards = currentItems.map((product: IProduct) => {
    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <div class="card">
        <img class="card__image" src="" alt="">
        <h2 class="card__title"></h2>
        <p class="card__price"></p>
        <span class="card__category"></span>
        <button class="card__button">Купить</button>
      </div>
    `;
    const card = new CardCatalog(
      events,
      cardContainer.firstElementChild as HTMLElement,
    );
    card.product = product;

    if (cart.has(product.id)) {
      card.setButtonText("Удалить из корзины");
    }

    return card.render();
  });
  gallery.catalog = cards;
});

events.on("basket:open", () => {
  const items = cart.getItems();

  if (items.length === 0) {
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "cart__empty";
    emptyContainer.innerHTML = "<p>Корзина пуста</p>";
    modal.contentElement = emptyContainer;
    modal.open();
    return;
  }

  const cartItemsElements = items.map((product) => {
    const itemContainer = document.createElement("div");
    itemContainer.innerHTML = `
      <div class="cart-item">
        <img class="cart-item__image" src="" alt="">
        <h3 class="cart-item__title"></h3>
        <p class="cart-item__price"></p>
        <button class="cart-item__delete">Удалить</button>
      </div>
    `;
    const cardCart = new CardCart(
      events,
      itemContainer.firstElementChild as HTMLElement,
    );
    cardCart.product = product;
    return cardCart.render();
  });

  const cartContainer = document.createElement("div");
  cartContainer.className = "cart__list";
  cartContainer.replaceChildren(...cartItemsElements);

  const totalElement = document.createElement("div");
  totalElement.className = "cart__total";
  totalElement.innerHTML = `
    <p>Итого: ${cart.getTotalPrice()} синапсов</p>
    <button class="cart__button button">Оформить заказ</button>
  `;
  cartContainer.appendChild(totalElement);

  const orderButton = totalElement.querySelector(".cart__button");
  if (orderButton) {
    orderButton.addEventListener("click", () => {
      modal.close();
    });
  }

  modal.contentElement = cartContainer;
  modal.open();
});

events.on("cart:item:remove", ({ productId }: { productId: string }) => {
  cart.remove(productId);
});

// Формы

events.on("form:contacts:submit", (data: Partial<IBuyer>) => {
  customer.set(data);

  const errors = customer.validate();

  if (Object.keys(errors).length === 0) {
    modal.close();
  } else {
    formContacts.errors = errors;
  }
});

events.on("form:payment:submit", ({ payment }: { payment: TPayment }) => {
  customer.set({ payment });

  const order = {
    ...customer.get(),
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  apiLarek
    .createOrder(order)
    .then((response) => {
      const successContainer = document.createElement("div");
      successContainer.innerHTML = `
      <div class="order-success">
        <p class="order-success__message"></p>
        <p class="order-success__total"></p>
        <button class="order-success__close">Закрыть</button>
      </div>
    `;
      const orderSuccessView = new OrderSuccess(
        events,
        successContainer.firstElementChild as HTMLElement,
      );
      orderSuccessView.order = response;
      modal.contentElement = orderSuccessView.render();
      modal.open();
      cart.clear();
      customer.clear();
    })
    .catch((error) => {
      console.error("Ошибка при создании заказа:", error);
    });
});

events.on("modal:close", () => {
  formContacts.contacts = {};
  formPayment.payment = {};
});

events.on("order:success:close", () => {
  modal.close();
});

// ============================================
// ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА
// ============================================

apiLarek
  .getProducts()
  .then((response: IProductsResponse) => {
    catalog.setItems(response.items);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });
