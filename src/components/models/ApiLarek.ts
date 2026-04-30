import {
  IApi,
  IOrder,
  IOrderResponse,
  IProductsResponse,
} from "../../../types";

export class ApiLarek {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductsResponse> {
    const response = await this.api.get<IProductsResponse>("/product/");
    return response;
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    const response = await this.api.post<IOrderResponse>("/order/", order);
    return response;
  }
}
