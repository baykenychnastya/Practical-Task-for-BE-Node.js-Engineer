import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { TicketController } from './ticket/ticket.controller';

@Module({
  imports: [TicketModule],
  controllers: [TicketController],
})
export class AppModule {}
