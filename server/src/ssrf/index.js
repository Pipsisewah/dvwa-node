const express = require('express');
const router = express.Router();
const { logger } = require('../logger');

const sanitization = {};
function sanitizeRequest(req, res, next){
    try {
        req.params = sanitization.sanitize !== undefined ? sanitization.sanitize(req.params) : req.params;
        req.body = sanitization.sanitize !== undefined ? sanitization.sanitize(req.body) : req.body;
        next();
    } catch (err) {
        return res.status(403).send('Sanitization Failure');
    }
}

router.get('/url-based-ssrf', async (req, res) => {
    try{
        const url = req.query.url;
        const response = await fetch(url);
        const data = await response.text();

        res.send(data);
    } catch (err) {
        logger.error(`Failed to get proper response: ${err.message}`);
        res.status(500).send('Failed to call URL');
    }
});

router.get('/remote-route', async(req, res) => {
    logger.info('Remote Route Hit');
    res.status(200).send('Remote Route Hit');
})

module.exports = {router, sanitization};