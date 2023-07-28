import axios from 'axios';
import { Ticket } from '../schemas/ticket.schema';
import { Injectable } from '@nestjs/common';
import { TicketEventsService } from './ticket.events.service';

@Injectable()
export class TicketService {
  constructor(private readonly ticketEventsService: TicketEventsService) {}

  async getTickets(eventId: number): Promise<Ticket[]> {
    const AVAILBLESTATUSID = 0;

    try {
      const [seatsResponse, pricesResponse] =
        await this.ticketEventsService.getEvents(eventId);

      const availableSeats = seatsResponse.filter(
        (ticket) => ticket.SeatStatusId === AVAILBLESTATUSID,
      );

      const ticketsPrice = new Map(
        pricesResponse
          .filter((ticketPrice) => ticketPrice.PerformanceId === 0)
          .map((ticketPrice) => [ticketPrice.ZoneId, ticketPrice.Price]),
      );

      const tickets = availableSeats.map((ticketSectionRowSeat) => {
        const { ZoneId, SeatRow, SeatNumber, SectionId } = ticketSectionRowSeat;
        const ticket: Ticket = new Ticket(
          SectionId,
          SeatRow,
          SeatNumber,
          ticketsPrice.get(ZoneId),
        );
        return ticket;
      });

      tickets.sort((a, b) => a.seatNumber - b.seatNumber);
      return tickets;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }
}
