// Import the Express module
const express = require('express');
const bodyParser = require('body-parser');
const ssppRouter = require('./sspp');

const server = {};

server.create = () => {
   return express();
}
server.prepare = (server, config, sanitize) => {
    server.use(bodyParser.json());

    Object.assign(ssppRouter.config,config);
    ssppRouter.sanitization.sanitize = sanitize;
    server.use('/sspp/', ssppRouter.router);
}
server.startServer = (app) => {
    const PORT = process.env.PORT || 3001; // Use the port specified in the environment variable 'PORT', or default to 3000
    return new Promise((resolve, reject) => {
        const server = app.listen(3001, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Server started');
                resolve(server);
            }
        });
    });
}

server.stopServer = (server) => {
    console.log('Closing Server');
    server.stop();
}


module.exports = server;