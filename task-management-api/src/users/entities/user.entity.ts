import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "../../shared/base-entity";
import { Task } from '../../tasks/entities/task.entity';
import { IsEmail, Length } from 'class-validator';


@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true, nullable: true })
  @Length(3, 20)
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];
}
