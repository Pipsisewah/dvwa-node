const server = require('./server');

const app = server.create();
server.prepare(app);
server.startServer(app);