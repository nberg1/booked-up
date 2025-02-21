import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Book Endpoints', () => {
  let token: string;
  let createdUserBookId: number; // Will store the ID from the UserBook join table

  // Create a test user and clear related tables before running tests.
  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.userBook.deleteMany({});

    const signupRes = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'booktester',
        email: 'booktester@example.com',
        password: 'password123'
      });
    token = signupRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new book and add it to the TBR list', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Author A',
        genre: 'Fiction',
        readingTime: 120,
        tags: ['tag1', 'tag2']
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('book');
    expect(res.body).toHaveProperty('userBook');
    createdUserBookId = res.body.userBook.id;
  });

  it('should retrieve the user\'s TBR list ordered by priority', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    // Optionally, check that the books are sorted by priority (ascending)
    const priorities = res.body.map((ub: any) => ub.priority);
    const sorted = [...priorities].sort((a, b) => a - b);
    expect(priorities).toEqual(sorted);
  });

  it('should update the book ordering (priority)', async () => {
    // Update order by setting a new priority for the created book.
    const res = await request(app)
      .put('/api/books/order/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        updates: [{ id: createdUserBookId, priority: 5 }]
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book order updated successfully');
  });

  it('should update book status', async () => {
    // Update the status of the book (e.g., change to 'reading')
    // We use the book endpoint that updates the UserBook record.
    // For this test, we assume the book id is needed; fetch the UserBook record first.
    const userBookRecord = await prisma.userBook.findUnique({ where: { id: createdUserBookId } });
    const bookId = userBookRecord?.bookId;
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'reading'
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book updated successfully');
  });

  it('should delete the book from the TBR list', async () => {
    // Retrieve the book id from the userBook record
    const userBookRecord = await prisma.userBook.findUnique({ where: { id: createdUserBookId } });
    const bookId = userBookRecord?.bookId;
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book removed from TBR list');
  });
});