var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
    urlItem: { type: String, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    class: { type: String, required: false },
    style: { type: String, required: false },
    background: { type: String, required: false },
    label: { type: String, required: false },
    author: { type: String, required: false },
    authorImg: { type: String, required: false },
    linkLabel: { type: String, required: false },
    viewTitle: { type: String, required: false },
    viewLink: { type: String, required: false }
});

module.exports = mongoose.model('item', Item);