const express = require('express');
const router = express.Router();
const { logger } = require('../logger');

const config = {};
const sanitization = {};

global.users = {
    "admin": {firstName: "The", lastName: "Admin"},
    "bob": {firstName: "Bob", lastName: "Smith"},
}

function updateUser(username, prop, value){
    users[username][prop] = value;
}

router.put("/api/users/:username", (req, res) => {
    try {
        let sanitizedParams;
        let sanitizedBody;
        try {
            sanitizedParams = sanitization.sanitize !== undefined ? sanitization.sanitize(req.params) : req.params;
            sanitizedBody = sanitization.sanitize !== undefined ? sanitization.sanitize(req.body) : req.body;
        } catch (err) {
            return res.status(403).send('Sanitization Failure');
        }
        let username = sanitizedParams.username;
        let user = JSON.parse(JSON.stringify(sanitizedBody));

        for (const attr in user) {
            updateUser(username, attr, user[attr]);
        }
        const obj = {};
        return res.status(201).send(obj.allowEval);
    }catch (err) {
        return res.status(500).send('And error occurred');
    }
})

router.get('/admin', (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    logger.info(`config.allowEval ${config.allowEval}`);
    if (!config.allowEval){
        return res.status(403).json({'response': 'AllowEval not set!'});
    }
    eval(body.code)
    return res.status(200).send('AllowEval IS set.  RCE could have been executed!');
})

module.exports = {router, config, sanitization};