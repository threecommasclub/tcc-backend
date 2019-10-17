import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { IsEmailAlreadyExist } from '../utils/is-email-already-exist';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Column('boolean', { default: false })
  verified: boolean;

  @Column({ default: 'USER' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // city priority: toronto, vancouver, newyork
}

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
