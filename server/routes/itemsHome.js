var express = require('express')
var Item = require('../models/item')
var app = express()

app.get('/items', (req, res) => {

    var items = [

        new Item({
            urlItem: "#",
            class: "grid-item grid-item--cs grid-item--dark grid-item--dark",
            style: "position: absolute; left: 51.4421%; top: 863px;",
            background: "images/lote.jpg",


            description: "la descrip",
            title: "Lote 1",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "Lote 1",
            viewLink: "Lote 1"
        }), new Item({
            urlItem: "#",
            class: "grid-item grid-item--default",
            style: "position: absolute; left: 0%; top: 0px;",
            background: "images/core/pattern--light.svg",


            description: "la descrip",
            title: "Modelos",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "varios modelos",
            viewLink: "modelos"
        }),
        new Item({
            urlItem: "#",
            class: "grid-item grid-item--default grid-item--dark",
            style: "position: absolute; left: 51.4421%; top: 0px;",
            background: "images/core/pattern--dark.svg",


            description: "la descrip",
            title: "Modelos 2",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "varios modelos 2",
            viewLink: "modelos 2"
        }),
        new Item({
            urlItem: "#",
            class: "grid-item grid-item--lg grid-item--default",
            style: "position: absolute; left: 0%; top: 431px;",
            background: "images/core/pattern--light.svg",


            description: "la descrip",
            title: "Modelos 3",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "varios modelos 3",
            viewLink: "modelos 3"
        }),
        new Item({
            urlItem: "#",
            class: "grid-item grid-item--cs grid-item--dark grid-item--dark",
            style: "position: absolute; left: 51.4421%; top: 863px;",
            background: "images/lote.jpg",


            description: "la descrip",
            title: "Modelos 4",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "varios modelos 4",
            viewLink: "modelos 4"
        }),
        new Item({
            urlItem: "#",
            class: "grid-item grid-item--lg grid-item--default grid-item--dark",
            style: "position: absolute; left: 0%; top: 1295px;",
            background: "images/core/pattern--dark.svg",


            description: "la descrip",
            title: "Modelos 5",
            label: "diferentes tipos de autos",

            author: "By Marco AVG",
            authorImg: "images/yo.jpg?h=5a3b9e47&amp;itok=7U35MgQB",

            viewTitle: "varios modelos 5",
            viewLink: "modelos 5"
        })

    ]
    res.json({
        items: items
    })

})

module.exports = app