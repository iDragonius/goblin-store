import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FreekassaClientService } from './freekassa-client.service';
import { FreekassaController } from './freekassa-client.controller';

@Module({
  imports: [HttpModule],
  providers: [FreekassaClientService],
  controllers: [FreekassaController],
  exports: [FreekassaClientService],
})
export class FreekassaClientModule {}
