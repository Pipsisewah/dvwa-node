const request = require('supertest');
const server = require('../src/server');

describe('sspp', () => {
    it('demonstrate Server Side Request Forgery', async () => {
        const app = server.create();
        server.prepare(app, {});
        // First Call
        const firstResponse = await request(app)
            .get('/ssrf/url-based-ssrf?url=http://google.com');
        expect(firstResponse.status).toBe(200);

    });
});