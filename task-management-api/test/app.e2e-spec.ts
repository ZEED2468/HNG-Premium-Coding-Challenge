import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Task Management API (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /tasks - should retrieve all tasks', async () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('POST /tasks - should create a new task', async () => {
    const newTask = {
      title: 'New Task',
      dueDate: new Date().toISOString(),
      status: 'pending',
    };
    return request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.task).toHaveProperty('id');
        expect(res.body.task.title).toBe(newTask.title);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
