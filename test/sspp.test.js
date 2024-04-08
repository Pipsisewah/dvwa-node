
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

    it('should block SSPP via Object.freeze() on config', async () => {
        const app = server.create();
        const config = {};
        Object.freeze(config);
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


    it('should block via sanitization', async () => {
        const sanitizeObject =  (obj) => {
            // Check if the object is not null and is of type 'object'
            if (obj !== null && typeof obj === 'object') {
                // Iterate over the keys of the object
                for (let key in obj) {
                    // Check if the key is '__proto__'
                    if (key === '__proto__') {
                        // If the key is '__proto__', delete it from the object
                        delete obj[key];
                    } else {
                        // If the key is not '__proto__', sanitize its value recursively
                        obj[key] = sanitizeObject(obj[key]);
                    }

                    // Check if the value is an object and not null
                    if (obj[key] !== null && typeof obj[key] === 'object') {
                        // If the value is an object, recursively sanitize it
                        obj[key] = sanitizeObject(obj[key]);
                    } else if (obj[key] === '__proto__') {
                        // If the value is '__proto__', replace it with null
                        obj[key] = null;
                        throw new Error('Sanitization Failure');
                    }
                }
            }
            // Return the sanitized object
            return obj;
        }
        const app = server.create();
        const config = {};
        server.prepare(app, config, sanitizeObject);
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
        expect(secondResponse.status).toBe(403);
    })
})