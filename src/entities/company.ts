import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, InputType, Float, Int, Root } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class LocationInput {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@ObjectType()
export class Location {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@InputType()
export class CompanyCreateInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  logo: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  province: string;

  @Field()
  country: string;

  @Field()
  zipCode: string;

  @Field()
  industry: string;

  @Field()
  size: string;

  @Field(() => Int)
  founded: number;

  @Field()
  description: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  tel?: string;

  @Field()
  website: string;

  @Field({ nullable: true })
  facebook?: string;

  @Field({ nullable: true })
  linkedin?: string;

  @Field(() => LocationInput)
  location: LocationInput;
}

@ObjectType()
@Entity('companies')
export class Company extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  logo: string;

  @Field()
  @Column('text')
  address: string;

  @Field()
  @Column('text')
  city: string;

  @Field()
  @Column('text')
  province: string;

  @Field()
  @Column('text')
  country: string;

  @Field()
  @Column('text')
  zipCode: string;

  @Field()
  fullAddress(@Root() parent: Company): string {
    return `${parent.address}, ${parent.city}, ${parent.province} ${parent.zipCode}`;
  }

  @Field()
  @Column('text')
  industry: string;

  @Field()
  @Column('text')
  size: string;

  @Field(() => Int)
  @Column('int')
  founded: number;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column('text')
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  tel?: string;

  @Field()
  @Column('text')
  website: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  facebook?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  linkedin?: string;

  @Field(() => Location)
  @Column('simple-json')
  location: Location;
}
