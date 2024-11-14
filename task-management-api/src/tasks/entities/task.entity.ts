import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from "../../shared/base-entity";
import { User } from '../../users/entities/user.entity';

@Entity()
@Index('status_index', ['status'])
@Index('due_date_index', ['dueDate'])
@Index('created_by_index', ['createdById'])
@Index('priority_index', ['priority']) 
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

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string; 

  @Column({ nullable: true })
  assignedTo: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];
}
