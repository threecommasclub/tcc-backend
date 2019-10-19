import { PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity('email_verifications')
export class EmailVerification extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  verificationCode: string;

  @Column('boolean', { default: true })
  enabled: boolean;

  @Column()
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
