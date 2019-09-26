import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';

import { IsEmailAlreadyExist } from '../utils/isEmailAlreadyExist';

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

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
