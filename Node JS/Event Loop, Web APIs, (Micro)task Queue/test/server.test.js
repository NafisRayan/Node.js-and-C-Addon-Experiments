const request = require('supertest');
const path = require('path');

let server;
beforeAll(() => {
  // Require server.js which starts the server and exports the running server
  server = require(path.join(__dirname, '..', 'server.js'));
});

test('GET / serves index.html', async () => {
  const res = await request('http://localhost:3000').get('/');
  expect(res.status).toBe(200);
  expect(res.text).toMatch(/Event Loop Visualizer/);
});

afterAll(() => {
  // Close the server started by server.js so Jest can exit cleanly
  if (server && server.close) server.close();
});
