import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('API endpoints', () => {
  describe('GET /api/health', () => {
    it('returns healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('GET /api/releases/steps', () => {
    it('returns the list of steps', async () => {
      const res = await request(app).get('/api/releases/steps');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(7);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('label');
    });
  });

  describe('POST /api/releases', () => {
    it('rejects invalid payload', async () => {
      const res = await request(app)
        .post('/api/releases')
        .send({ name: '' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects missing date', async () => {
      const res = await request(app)
        .post('/api/releases')
        .send({ name: 'Test Release' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/releases/:id', () => {
    it('rejects invalid UUID', async () => {
      const res = await request(app).get('/api/releases/not-a-uuid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/releases/:id/steps', () => {
    it('rejects invalid step toggle payload', async () => {
      const res = await request(app)
        .patch('/api/releases/00000000-0000-0000-0000-000000000000/steps')
        .send({ stepId: 'abc', completed: true });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('404 handling', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
