const request = require('supertest');
const { app, server: mainServer } = require('../server');
let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log('Test server closed');
    mainServer.close(() => {
      console.log('Main server closed');
      done();
    });
  });
});

describe('Log Collection API', () => {
  test('GET /files - success', async () => {
    const res = await request(app).get('/files');
    expect(res.statusCode).toBe(200);
  });

  test('GET /logs/:filename - file not found', async () => {
    const res = await request(app).get('/logs/nonexistentfile.log');
    expect(res.statusCode).toBe(404);
  });
});
