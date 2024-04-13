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

function sanitizeRequest(req, res, next){
    try {
        req.params = sanitization.sanitize !== undefined ? sanitization.sanitize(req.params) : req.params;
        req.body = sanitization.sanitize !== undefined ? sanitization.sanitize(req.body) : req.body;
        next();
    } catch (err) {
        return res.status(403).send('Sanitization Failure');
    }
}

router.put("/api/users/:username", sanitizeRequest, (req, res) => {
    try {
        let username = req.params.username;
        let user = (req.body);
        for (const attr in user) {
            updateUser(username, attr, user[attr]);
        }
        const obj = {};
        return res.status(201).send(obj.allowEval);
    }catch (err) {
        return res.status(500).send('And error occurred');
    }
})

router.get('/admin', sanitizeRequest, (req, res) => {
    logger.info(`config.allowEval ${config.allowEval}`);
    if (!config.allowEval){
        return res.status(403).json({'response': 'AllowEval not set!'});
    }
    eval(req.body.code)
    return res.status(200).send('AllowEval IS set.  RCE could have been executed!');
})

module.exports = {router, config, sanitization};