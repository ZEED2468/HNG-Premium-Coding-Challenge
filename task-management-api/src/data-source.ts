import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { config } from 'dotenv';
config(); // Load .env variables if necessary

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'your_db_username',
  password: process.env.DATABASE_PASSWORD || 'your_db_password',
  database: process.env.DATABASE_NAME || 'your_db_name',
  entities: [User, Task],
  migrations: ['src/migration/*.ts'], // Adjust path if needed
  synchronize: false, // Disable in production
});
