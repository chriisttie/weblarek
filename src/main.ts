// src/main.ts

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
import { API_URL, CDN_URL } from "./utils/constants";

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

let formContacts: FormContacts | null = null;
let formPayment: FormPayment | null = null;
let activeProductFull: ProductFull | null = null; // ✅ Для обновления кнопки
let isBasketOpen = false;

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ (PRESENTER)
// ============================================

// --- Каталог товаров ---

events.on("catalog:change", ({ items }: { items: IProduct[] }) => {
  const cards = items.map((product: IProduct) => {
    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <button class="gallery__item card">
        <span class="card__category"></span>
        <h2 class="card__title"></h2>
        <img class="card__image" src="" alt="" />
        <span class="card__price"></span>
      </button>
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
    <div class="card card_full">
      <img class="card__image" src="" alt="" />
      <div class="card__column">
        <span class="card__category"></span>
        <h2 class="card__title"></h2>
        <p class="card__text"></p>
        <div class="card__row">
          <button class="button card__button">Купить</button>
          <span class="card__price"></span>
        </div>
      </div>
    </div>
  `;
  const productFull = new ProductFull(
    events,
    modalContainer.firstElementChild as HTMLElement,
  );
  productFull.product = product;

  // ✅ Сохраняем ссылку на активный ProductFull
  activeProductFull = productFull;

  modal.contentElement = productFull.render();
  modal.open();
});

events.on("product:add", ({ productId }: { productId: string }) => {
  const product = catalog.getItemById(productId);
  if (product) {
    const isInCart = cart.has(productId);

    if (isInCart) {
      cart.remove(productId);
    } else {
      cart.add(product);
    }

    // ✅ Обновляем кнопку в модальном окне
    if (activeProductFull) {
      activeProductFull.updateButtonText(!isInCart);
    }
  }
});

// --- Корзина ---

events.on("cart:change", () => {
  header.counter = cart.getCount();

  // ✅ Обновляем кнопку в активном модальном окне
  if (activeProductFull && modal.isActive()) {
    const productId = activeProductFull.getProductId();
    if (productId) {
      const isInCart = cart.has(productId);
      activeProductFull.updateButtonText(isInCart);
    }
  }

  // ✅ Перерисовываем каталог
  const currentItems = catalog.getItems();
  const cards = currentItems.map((product: IProduct) => {
    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <button class="gallery__item card">
        <span class="card__category"></span>
        <h2 class="card__title"></h2>
        <img class="card__image" src="" alt="" />
        <span class="card__price"></span>
      </button>
    `;
    const card = new CardCatalog(
      events,
      cardContainer.firstElementChild as HTMLElement,
    );
    card.product = product;
    return card.render();
  });
  gallery.catalog = cards;

  // ✅ Перерисовываем корзину если открыта
  if (isBasketOpen) {
    const items = cart.getItems();

    if (items.length === 0) {
      const emptyContainer = document.createElement("div");
      emptyContainer.className = "cart__empty";
      emptyContainer.innerHTML = "<p>Корзина пуста</p>";
      modal.contentElement = emptyContainer;
      return;
    }

    const cartItemsElements = items.map((product, index) => {
      const itemContainer = document.createElement("li");
      itemContainer.className = "basket__item card card_compact";
      itemContainer.innerHTML = `
        <span class="basket__item-index">${index + 1}</span>
        <span class="card__title">${product.title}</span>
        <span class="card__price">${product.price} синапсов</span>
        <button class="basket__item-delete card__button" aria-label="удалить"></button>
      `;
      const cardCart = new CardCart(events, itemContainer);
      cardCart.product = { ...product, id: product.id };
      return itemContainer;
    });

    const newCartContainer = document.createElement("div");
    newCartContainer.className = "basket";

    const listElement = document.createElement("ul");
    listElement.className = "basket__list";
    listElement.replaceChildren(...cartItemsElements);
    newCartContainer.appendChild(listElement);

    const actionsElement = document.createElement("div");
    actionsElement.className = "modal__actions";
    actionsElement.innerHTML = `
      <button type="button" class="button basket__button">Оформить</button>
      <span class="basket__price">${cart.getTotalPrice()} синапсов</span>
    `;
    newCartContainer.appendChild(actionsElement);

    const orderButton = actionsElement.querySelector(".basket__button");
    if (orderButton) {
      orderButton.addEventListener("click", (event: Event) => {
        event.preventDefault();
        const template = document.getElementById(
          "order",
        ) as HTMLTemplateElement;
        const formContainer = template.content.cloneNode(true) as HTMLElement;
        const formElement = formContainer.querySelector("form") as HTMLElement;
        formPayment = new FormPayment(events, formElement);
        modal.contentElement = formPayment.render();
        isBasketOpen = false;
      });
    }

    modal.contentElement = newCartContainer;
  }
});

events.on("basket:open", () => {
  isBasketOpen = true;

  const items = cart.getItems();

  if (items.length === 0) {
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "cart__empty";
    emptyContainer.innerHTML = "<p>Корзина пуста</p>";
    modal.contentElement = emptyContainer;
    modal.open();
    return;
  }

  const cartItemsElements = items.map((product, index) => {
    const itemContainer = document.createElement("li");
    itemContainer.className = "basket__item card card_compact";
    itemContainer.innerHTML = `
      <span class="basket__item-index">${index + 1}</span>
      <span class="card__title">${product.title}</span>
      <span class="card__price">${product.price} синапсов</span>
      <button class="basket__item-delete card__button" aria-label="удалить"></button>
    `;
    const cardCart = new CardCart(events, itemContainer);
    cardCart.product = { ...product, id: product.id };
    return itemContainer;
  });

  const cartContainer = document.createElement("div");
  cartContainer.className = "basket";

  const listElement = document.createElement("ul");
  listElement.className = "basket__list";
  listElement.replaceChildren(...cartItemsElements);
  cartContainer.appendChild(listElement);

  const actionsElement = document.createElement("div");
  actionsElement.className = "modal__actions";
  actionsElement.innerHTML = `
    <button type="button" class="button basket__button">Оформить</button>
    <span class="basket__price">${cart.getTotalPrice()} синапсов</span>
  `;
  cartContainer.appendChild(actionsElement);

  const orderButton = actionsElement.querySelector(".basket__button");
  if (orderButton) {
    orderButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const template = document.getElementById("order") as HTMLTemplateElement;
      const formContainer = template.content.cloneNode(true) as HTMLElement;
      const formElement = formContainer.querySelector("form") as HTMLElement;

      formPayment = new FormPayment(events, formElement);
      modal.contentElement = formPayment.render();
      isBasketOpen = false;
    });
  }

  modal.contentElement = cartContainer;
  modal.open();
});

events.on("cart:item:remove", ({ productId }: { productId: string }) => {
  cart.remove(productId);
});

// --- Формы ---

events.on(
  "form:payment:submit",
  ({ payment, address }: { payment: TPayment; address: string }) => {
    customer.set({ payment, address });

    const template = document.getElementById("contacts") as HTMLTemplateElement;
    const formContainer = template.content.cloneNode(true) as HTMLElement;
    const formElement = formContainer.querySelector("form") as HTMLElement;

    formContacts = new FormContacts(events, formElement);
    modal.contentElement = formContacts.render();
  },
);

events.on("form:contacts:submit", (data: Partial<IBuyer>) => {
  customer.set(data);

  const errors = customer.validate();

  if (Object.keys(errors).length === 0) {
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
            <h2 class="order-success__title">Заказ оформлен</h2>
            <p class="order-success__description">Списано ${response.total} синапсов</p>
            <button class="button order-success__close">За новыми покупками!</button>
          </div>
        `;
        const orderSuccessView = new OrderSuccess(
          events,
          successContainer.firstElementChild as HTMLElement,
        );
        orderSuccessView.order = response;
        modal.contentElement = orderSuccessView.render();
        cart.clear();
        customer.clear();
      })
      .catch((error) => {
        console.error("Ошибка при создании заказа:", error);
      });
  } else {
    if (formContacts) {
      formContacts.errors = errors;
    }
  }
});

events.on("modal:close", () => {
  formContacts = null;
  formPayment = null;
  activeProductFull = null; // ✅ Очищаем ссылку
  isBasketOpen = false;
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
