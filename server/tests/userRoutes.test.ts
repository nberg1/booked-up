import request from 'supertest';
import app from '../src/index'; // Ensure your Express app is exported from src/index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Routes', () => {
  // Clear users before tests run
  beforeAll(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let token: string;

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword'
      });
      
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    token = res.body.token;
  });

  it('should log in the user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword'
      });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should retrieve the user profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('testuser@example.com');
  });
});
