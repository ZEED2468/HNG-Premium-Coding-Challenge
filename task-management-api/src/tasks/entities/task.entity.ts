import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from "../../shared/base-entity";
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  dueDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'low' })
  priority: string;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @Column({ nullable: true })
  assignedTo: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];
}
