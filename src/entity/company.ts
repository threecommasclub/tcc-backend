import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int, InputType } from 'type-graphql';

@InputType()
export class CompanyCreateInput implements Partial<Company> {
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
  zip_code: string;

  @Field()
  @Column('text')
  industry: string;

  @Field()
  @Column('text')
  size: string;

  @Field()
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
}

@ObjectType()
@Entity('companies')
export class Company extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

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
  zip_code: string;

  @Field()
  @Column('text')
  industry: string;

  @Field()
  @Column('text')
  size: string;

  @Field()
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
}
