const express = require('express')
const router = express.Router()
const responseJSON = require('./../jsonData/responses/responses-with-message.json')

// Login with username and password
router.post('/LoginApi/auth-service/v1.0/session', (req, res) => {
    console.log('req.body: ', req.body);
    if (req.body.name === "cmtg" && req.body.password === "cmtg") {
        res.json(
            {
                "sessionId": "f7dd3fe7-a792-41b4-b6ee-0d35d3405c6e"
            }
        );
    } else {
        res.status(401).json(responseJSON.response401);
    }
})

// Logout and terminate session
router.delete('/LoginApi/auth-service/v1.0/session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    console.log('sessionId: ', sessionId);
    if (sessionId === "f7dd3fe7-a792-41b4-b6ee-0d35d3405c6e") {
        res.send("SUCCESS");
    } else {
        res.status(400).json(
            {
                "errorCode": "string",
                "message": "string"
            }
        );
    }
})

// Refresh user session via sessionId
router.put('/LoginApi/auth-service/v1.0/session', (req, res) => {
    if (req.body.sessionId === "f7dd3fe7-a792-41b4-b6ee-0d35d3405c6e") {
        res.json("SUCCESS");
    } else {
        res.status(400).json(responseJSON.response400);
    }
})

// Timeout value for sessions
router.get('/LoginApi/auth-service/v1.0/session/time-out', (req, res) => {
    res.send('8400;600;60');
})

router.get('/LoginApi/auth-service/v1.0/cm-clli', (req, res) => {
    res.send("CO24");
})

router.get('/LoginApi/auth-service/v1.0/session/validation/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    console.log('sessionId: ', sessionId);
    res.send('SUCCESS');
})

module.exports = router