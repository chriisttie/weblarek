import "./scss/styles.scss";

import { Catalog } from "./components/base/models/Catalog";
import { Cart } from "./components/base/models/Cart";
import { Customer } from "./components/base/models/Customer";
import { apiProducts } from "./utils/data";
import { ApiLarek } from "./components/base/models/ApiLarek";
import { Api } from "./components/base/Api";
import { IProduct } from "./types";

console.log("=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===\n");

//  Тестирование Catalog
console.log("--- Каталог товаров ---");
const catalog = new Catalog();
catalog.setItems(apiProducts.items);

console.log("Массив товаров из каталога:", catalog.getItems());
console.log(
  "Товар по ID (первый из списка):",
  catalog.getItemById(apiProducts.items[0]?.id),
);

const previewItem = apiProducts.items[0];
if (previewItem) {
  catalog.setPreviewProduct(previewItem);
  console.log("Товар для предпросмотра:", catalog.getPreviewProduct());
}

// Тестирование Cart
console.log("\n--- Корзина ---");
const cart = new Cart();

if (apiProducts.items[0]) cart.add(apiProducts.items[0]);
if (apiProducts.items[1]) cart.add(apiProducts.items[1]);

console.log("Товары в корзине:", cart.getItems());
console.log("Количество товаров:", cart.getCount());
console.log("Общая стоимость:", cart.getTotalPrice());
console.log(
  "Есть ли первый товар в корзине:",
  cart.has(apiProducts.items[0]?.id),
);
console.log("Есть ли несуществующий товар:", cart.has("non-existent-id"));

cart.remove(apiProducts.items[0]?.id);
console.log("Корзина после удаления первого товара:", cart.getItems());

cart.clear();
console.log("Корзина после очистки:", cart.getItems());

// Тестирование Customer
console.log("\n--- Покупатель ---");
const customer = new Customer();

customer.set({ email: "test@example.com", phone: "+79990000000" });
console.log("Данные после частичного заполнения:", customer.get());

customer.set({ address: "Москва, ул. Пушкина", payment: "online" });
console.log("Данные после полного заполнения:", customer.get());

console.log("Валидация (должна быть пустая):", customer.validate());

customer.clear();
console.log(
  "Валидация после очистки (должны быть ошибки):",
  customer.validate(),
);

console.log("\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===");

console.log("\n=== РАБОТА С СЕРВЕРОМ ===\n");

const api = new Api("https://larek-api.nomoreparties.co/api/weblarek");

//  слой коммуникации
const apiLarek = new ApiLarek(api);

apiLarek
  .getProducts()
  .then((products: IProduct[]) => {
    console.log("Товары с сервера:", products);

    // Сохраняем в модель каталога
    catalog.setItems(products);

    // Проверяем, что данные сохранились
    console.log("Каталог после загрузки:", catalog.getItems());
    console.log("Количество товаров в каталоге:", catalog.getItems().length);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });
