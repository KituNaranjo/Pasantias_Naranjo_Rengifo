const { Schema, model } = require('mongoose');

const serviceSchema = new Schema({
    nombre: {type: String},
    description: {type: String},
    fileUrl: {type: String},
    uploadDate: {type: Date, default: Date.now()}

});

module.exports = model('Image', serviceSchema);
