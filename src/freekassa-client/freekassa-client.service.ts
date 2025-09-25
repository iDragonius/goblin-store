import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { createHmac } from 'crypto';
import { CreateOrderDto, FreeKassaCreateOrderResponse } from '../types';

@Injectable()
export class FreekassaClientService {
  constructor(private readonly http: HttpService) {}
  private get shopId() {
    return Number(process.env.FK_SHOP_ID);
  }

  private get apiKey() {
    return process.env.FK_API_KEY!;
  }

  private get paymentSystemId() {
    return Number(process.env.FK_PAYMENT_SYSTEM_ID);
  }

  private get currency() {
    return process.env.FK_CURRENCY || 'RUB';
  }

  private get defaultEmail() {
    return process.env.FK_DEFAULT_EMAIL || 'test@example.com';
  }
  private signPayloadAll(
    data: Record<string, unknown>,
    apiKey: string,
  ): string {
    // выбрасываем пустые/undefined и саму signature
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(data)) {
      if (k === 'signature') continue;
      if (v === undefined || v === null) continue;
      if (typeof v === 'object') {
        throw new Error(`Cannot sign object field "${k}"`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clean[k] = v as any;
    }
    const entries = Object.entries(clean).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const payload = entries.map(([, v]) => String(v)).join('|');
    return createHmac('sha256', apiKey).update(payload).digest('hex');
  }
  private generateOrderId(product: string): string {
    const now = new Date();

    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = String(now.getFullYear());

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    const random = Math.floor(10000 + Math.random() * 90000);

    return `ORD-${product}-${dd}${mm}${yyyy}-${hh}${min}-${random}`;
  }
  async createOrder(
    input: Omit<
      CreateOrderDto,
      'signature' | 'nonce' | 'shopId' | 'i' | 'currency'
    >,
    ip: string,
  ): Promise<FreeKassaCreateOrderResponse> {
    const nonce = Date.now();

    const bodyWithoutSignature = {
      shopId: this.shopId,
      nonce,
      i: this.paymentSystemId,
      ip,
      amount: input.amount,
      paymentId: this.generateOrderId(input.product),
      email: input.userName
        ? `${input.userName}@dummy.local`
        : input.userId
          ? `${input.userId}@dummy.local`
          : this.defaultEmail,
      currency: this.currency,
    };
    const signature = this.signPayloadAll(bodyWithoutSignature, this.apiKey);

    const body = {
      ...bodyWithoutSignature,
      signature,
    };
    const { data } = await firstValueFrom(
      this.http
        .post<FreeKassaCreateOrderResponse>(
          'https://api.fk.life/v1/orders/create',
          body,
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10_000,
          },
        )
        .pipe(
          catchError((err: AxiosError) => {
            const details = err.response?.data ?? err.message;
            throw new Error(
              `FK createOrder failed: ${JSON.stringify(details)}`,
            );
          }),
        ),
    );

    return data;
  }
}
