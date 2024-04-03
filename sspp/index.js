const express = require('express');
const router = express.Router();

const config = {
    //allowEval: false
}

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

    return res.status(201).send();
})


router.get('/', (req, res) => {
    res.send('SubSSPP');
});


router.get('/admin', (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    console.log(`Config ${config.allowEval}`);
    if (!config.allowEval){
        return res.status(403).send('AllowEval not set!');
    }
    eval(body.code)
    return res.status(200).send('AllowEval IS set.  RCE could have been executed!');
})

module.exports = router;