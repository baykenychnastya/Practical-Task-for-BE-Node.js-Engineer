import { Resolver, Args, Query } from '@nestjs/graphql';
import { Ticket } from '../schemas/ticket.schema';
import { TicketService } from '../services/ticket.services';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Query(() => [Ticket])
  async getTickets(@Args('eventId') eventId: number): Promise<Ticket[]> {
    return this.ticketService.getTickets(eventId);
  }
}
