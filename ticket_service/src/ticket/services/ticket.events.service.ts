import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketEventsService {
  async getEvents(
    eventId: number,
  ): Promise<[TicketSectionRowSeat[], TicketPrice[]]> {
    try {
      const [seatsResponse, pricesResponse] = await Promise.all([
        axios.get<TicketSectionRowSeat[]>(
          `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Seats?constituentId=0&modeOfSaleId=26&packageId=${eventId}`,
        ),
        axios.get<TicketPrice[]>(
          `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Prices?expandPerformancePriceType=&includeOnlyBasePrice=&modeOfSaleId=26&priceTypeId=&sourceId=30885`,
        ),
      ]);
      return [seatsResponse.data, pricesResponse.data];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }
}

export interface TicketSectionRowSeat {
  SectionId: number;
  SeatRow: string;
  SeatNumber: number;
  ZoneId: number;
  SeatStatusId: number;
}

export interface TicketPrice {
  Price: number;
  ZoneId: number;
  PerformanceId: number;
}
