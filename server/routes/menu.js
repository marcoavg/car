var express = require('express')
var Menu = require('../models/menu')
var app = express()

app.get('/menu', (req, res) => {

    var menu = [
        new Menu({
            url: "#",
            title: "Informacion",
            description: "Informacion del carros nuevos"
        }),
        new Menu({
            url: "#",
            title: "Trabajamos con",
            description: "Trabajamos con los clientes"
        }),
        new Menu({
            url: "#",
            title: "Servicios",
            description: "Servicios informativos"
        }),
        new Menu({
            url: "#",
            title: "Ideas",
            description: "Ideas para ti"
        }),
        new Menu({
            url: "#",
            title: "Contacto",
            description: "Contacto"
        })
    ]
    res.json({
        menu: menu
    })

})

module.exports = app