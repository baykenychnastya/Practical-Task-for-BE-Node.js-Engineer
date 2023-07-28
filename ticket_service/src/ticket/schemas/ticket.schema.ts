import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Ticket {
  @Field()
  section: number;

  @Field()
  row: string;

  @Field()
  seatNumber: number;

  @Field()
  price: number;

  constructor(section: number, row: string, seatNumber: number, price: number) {
    this.section = section;
    this.row = row;
    this.seatNumber = seatNumber;
    this.price = price;
  }
}
