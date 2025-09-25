// freekassa.controller.ts
import { Body, Controller, Ip, Post } from '@nestjs/common';
import { FreekassaClientService } from './freekassa-client.service';
import { CreateOrderDto, FreeKassaCreateOrderResponse } from '../types';
import slugify from 'slugify';

@Controller('fk')
export class FreekassaController {
  constructor(private readonly fk: FreekassaClientService) {}

  @Post('order')
  async createOrder(
    @Body() body: Omit<CreateOrderDto, 'shopId' | 'nonce' | 'signature'>,
    @Ip() ip: string,
  ): Promise<FreeKassaCreateOrderResponse> {
    // const shopId = +process.env.FK_SHOP_ID!;
    // const apiKey = process.env.FK_API_KEY!;
    body.product = slugify(body.product, { lower: true }).slice(0, 100);
    console.log(body);

    return this.fk.createOrder(body, ip);
  }
}
