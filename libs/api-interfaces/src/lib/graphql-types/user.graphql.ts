// lib/api-interfaces/src/graphql/user.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "uuid")')
@Directive('@shareable')
export class User {
  @Field(() => ID)
  uuid!: string;

  @Field()
  auth0ID!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}
