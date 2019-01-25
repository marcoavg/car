const express = require('express')
const app = express()
const mongoose = require('mongoose')
const hbs = require('hbs')
require('./hbs/helpers')

const port = process.env.PORT || 3002

app.use(express.static(__dirname + '/public'))
hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs');
app.use(require('./server/routes/index'))

app.listen(port, () => {
    console.log('escuchando peticiones ' + port);
})