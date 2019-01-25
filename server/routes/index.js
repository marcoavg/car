const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/about', (req, res) => {
    res.render('about')
})


app.use(require('./menu'))
app.use(require('./itemsHome'))


module.exports = app