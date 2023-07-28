import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('TicketResolver (e2e)', () => {
  let app;
  const eventId = 1195;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
            section: expect.any(Number),
            row: expect.any(String),
            seatNumber: expect.any(Number),
            price: expect.any(Number),
          },
        ]),
      },
    });
  });
});
