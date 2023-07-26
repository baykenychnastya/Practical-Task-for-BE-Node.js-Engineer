import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';

@Controller('concert-tickets')
export class TicketController {
  @Get(':eventId')
  async getTickets(@Param('eventId') eventId: string) {
    const url = `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Seats?constituentId=0&modeOfSaleId=26&packageId=${eventId}`;
    const urlPrice = `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Prices?expandPerformancePriceType=&includeOnlyBasePrice=&modeOfSaleId=26&priceTypeId=&sourceId=30885`;
    const AVAILBLESTATUSID = 0;
    try {
      const response = await axios.get(url);
      const responsePrice = await axios.get(urlPrice);

      const AllTicketsSectionRowSeat: TicketSectionRowSeat[] = response.data;
      const ticketsSectionRowSeat = AllTicketsSectionRowSeat.filter(
        (ticket) => ticket.SeatStatusId === AVAILBLESTATUSID,
      );

      const ticketsPrice: TicketPrice[] = responsePrice.data;

      const t: Ticket[] = [];

      for (const ticketSectionRowSeat of ticketsSectionRowSeat) {
        const ticket: Ticket = new Ticket();
        for (const ticketPrice of ticketsPrice) {
          if (
            ticketSectionRowSeat.ZoneId === ticketPrice.ZoneId &&
            ticketPrice.PerformanceId === 0
          ) {
            ticket.price = ticketPrice.Price;
          }
        }
        ticket.section = ticketSectionRowSeat.SectionId;
        ticket.row = ticketSectionRowSeat.SeatRow;
        ticket.seatNumber = ticketSectionRowSeat.SeatNumber;
        t.push(ticket);
      }

      t.sort((a, b) => a.seatNumber - b.seatNumber);
      return t;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }
}

class Ticket {
  section: string;
  row: string;
  seatNumber: number;
  price: number;
}

interface TicketSectionRowSeat {
  SectionId: string;
  SeatRow: string;
  SeatNumber: number;
  ZoneId: number;
  SeatStatusId: number;
}

interface TicketPrice {
  Price: number;
  ZoneId: number;
  PerformanceId: number;
}
