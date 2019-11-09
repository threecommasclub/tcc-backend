import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { Company } from './company';

@ObjectType()
@Entity('tags')
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Company)
  companies: Company[];
}
