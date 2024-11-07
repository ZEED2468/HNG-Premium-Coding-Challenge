import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "../../shared/base-entity";
import { Task } from '../../tasks/entities/task.entity';


@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];
}
