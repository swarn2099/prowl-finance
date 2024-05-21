// lib/api-interfaces/src/graphql/user.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "uuid")')
@Directive('@shareable')
export class CoinbaseAccount {
  @Field(() => ID)
  uuid!: string;

  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field({ nullable: true })
  createdAt!: Date;

  @Field({ nullable: true })
  updatedAt!: Date;
}
