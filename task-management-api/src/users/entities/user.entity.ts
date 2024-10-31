import { Entity, Column } from 'typeorm';
import { BaseEntity } from "../../shared/base-entity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  password: string;
}
