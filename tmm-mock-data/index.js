// import API
const login = require('./api/login');
const tmm = require('./api/tmm');
//
const express = require('express')
var cors = require('cors')
var cookieParser = require('cookie-parser');



const app = express()
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());


// API
app.use(login)
app.use(tmm)
