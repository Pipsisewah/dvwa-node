const express = require('express');
const router = express.Router();
const { logger } = require('../logger');

const config = {};

global.users = {
    "admin": {firstName: "The", lastName: "Admin"},
    "bob": {firstName: "Bob", lastName: "Smith"},
}

function updateUser(username, prop, value){
    users[username][prop] = value;
}

router.put("/api/users/:username", (req, res) => {
    let username = req.params.username;
    let user = JSON.parse(JSON.stringify(req.body));

    for(const attr in user){
        updateUser(username, attr, user[attr]);
    }
    const obj = {};
    return res.status(201).send(obj.allowEval);
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

module.exports = {router, config};