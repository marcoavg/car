var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var item = new Schema({
    url: { type: String, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false }
});

item.methods.toJSON = function() {
    let item = this
    let itemObject = item.toObject()
    delete item._id
    return itemObject
}

module.exports = mongoose.model('menu', item);