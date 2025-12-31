const express = require('express')
const bodyParser = require('body-parser')
const requestLogger = require('./requestLogger')

const app = express()

app.use(bodyParser.json())

app.use(requestLogger)

app.get('/', (req, res) => {
    res.send(`Hello! Your Request id is ${req.requestId}`)
})

app.listen(3000, () => {
    console.log("Server Port is 3000");
})

