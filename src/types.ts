// Ответ от FreeKassa
export interface FreeKassaCreateOrderResponse {
  type: 'success' | 'error';
  orderId?: number;
  orderHash?: string;
  location?: string; // ссылка на оплату
  message?: string; // если type = error
}

// Общий generic для других методов, если надо будет
export type FreeKassaResponse<T> = {
  type: 'success' | 'error';
  message?: string;
} & T;

// Тело запроса (минимально обязательные поля + опциональные)
export interface CreateOrderDto {
  shopId: number;
  nonce: number;
  signature: string;
  email: string;
  ip: string;
  amount: number;
  product: string;
  userName: string | null;
  userId: string;
}
