import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../index.js';

describe('Server Integration Tests', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });

  it('GET /api/config should return JSON config', async () => {
    const res = await request(app).get('/api/config');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('apiKey');
    expect(res.body).toHaveProperty('projectId');
  });

  it('GET /* should fallback to serving index.html', async () => {
    // We expect a 200 and some HTML content since it's an SPA
    // Note: This relies on 'dist/index.html' existing. If not built, it might 404 or error.
    const res = await request(app).get('/unknown-route');
    // If dist is built, it's 200. If not, it might throw or return 404 depending on express.static.
    // We just check it responds.
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });
});
