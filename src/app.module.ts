import { Module } from '@nestjs/common';
import { FreekassaClientModule } from './freekassa-client/freekassa-client.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    FreekassaClientModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true, // чтобы доступно было во всех сервисах
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
