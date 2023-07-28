import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TicketService } from '../src/ticket/services/ticket.services';
import { TicketEventsService } from '../src/ticket/services/ticket.events.service';
import { TicketResolver } from '../src/ticket/resolvers/ticket.resolver';
import { AppModule } from '../src/app.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

describe('TicketResolver (e2e)', () => {
  let app;
  const eventId = 1195;
  const mockTicketEventsService: TicketEventsService = {
    getEvents: jest.fn().mockResolvedValue([
      [
        {
          SectionId: 1,
          SeatRow: 'A',
          SeatNumber: 101,
          ZoneId: 100,
          SeatStatusId: 0,
        },
      ],
      [
        {
          Price: 50,
          ZoneId: 100,
          PerformanceId: 0,
        },
        {
          Price: 550,
          ZoneId: 100,
          PerformanceId: 10,
        },
      ],
    ]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        TicketResolver,
        TicketService,
        {
          provide: TicketEventsService,
          useValue: mockTicketEventsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of tickets', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          getTickets(eventId: ${eventId}) {
            section
            row
            seatNumber
            price
          }
        }`,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      data: {
        getTickets: expect.arrayContaining([
          {
            section: 1,
            row: 'A',
            seatNumber: 101,
            price: 50,
          },
        ]),
      },
    });
  });
});
