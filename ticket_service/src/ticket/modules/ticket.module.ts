import { Module } from '@nestjs/common';
import { TicketResolver } from '../resolvers/ticket.resolver';
import { TicketService } from '../services/ticket.services';
import { TicketEventsService } from '../services/ticket.events.service';

@Module({
  providers: [TicketResolver, TicketService, TicketEventsService],
})
export class TicketModule {}
