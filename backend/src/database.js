const mongoose = require('mongoose');
const URI = 'mongodb://127.0.0.1/usuarios';

mongoose.set("strictQuery", true);
mongoose.connect(URI)
    .then(db => console.log('DB conectada'))
    .catch(err => console.log(err));

module.exports = mongoose;