import {
  IApi,
  IProduct,
  IOrder,
  IOrderResponse,
  IProductsResponse,
} from "../../../types";

export class ApiLarek {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this._api.get<IProductsResponse>("/product/");
    return response.items;
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    const response = await this._api.post<IOrderResponse>("/order/", order);
    return response;
  }
}
