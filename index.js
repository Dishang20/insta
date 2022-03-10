const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

require('./src/db/conn')
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, token, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
const apiRoutes = require('./src/router/index.routes')
app.use('/', apiRoutes)

app.listen(PORT, () => {
    console.log('Server started');
})
