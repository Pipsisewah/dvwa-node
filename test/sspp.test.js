
const request = require('supertest');
const server = require('../src/server');

describe('sspp', () => {
    it('demonstrate Server Side Prototype Pollution', async () => {
        const app = server.create();
        server.prepare(app, {});
        const data = {"allowEval": true};

        // First Call
        const firstResponse = await request(app)
            .get('/sspp/admin');
        expect(firstResponse.status).toBe(403);

        // Second Call
        const secondResponse = await request(app)
            .put('/sspp/api/users/__proto__')
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(secondResponse.status).toBe(201);

        // Third Call
        const thirdResponse = await request(app)
            .get('/sspp/admin')
        expect(thirdResponse.status).toBe(200);
    })

    it('should block SSPP because the config allowEval was directly set on the object', async () => {
        const app = server.create();
        const config = {allowEval: false};
        server.prepare(app, config);
        const data = {"allowEval": true};

        // First Call
        const firstResponse = await request(app)
            .get('/sspp/admin');
        expect(firstResponse.status).toBe(403);

        // Second Call
        const secondResponse = await request(app)
            .put('/sspp/api/users/__proto__')
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(secondResponse.status).toBe(201);

        // Third Call
        const thirdResponse = await request(app)
            .get('/sspp/admin')
        expect(thirdResponse.status).toBe(403);
    })
})