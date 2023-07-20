'use strict'
const express = require('express');
const path = require('path');
const morgan = require('morgan');
//const { v4: uuidv4 } = require('uuid'); 
//Initializations
const app = express();

const cors = require('cors');

require('./database')


//Settings 
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

//Middlewards
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//app.use(multer({ storage: storage }).single('image'));

//Routes

app.use(require('./routes/index'));
app.use(express.static(path.join(__dirname, 'backend/src/upload')));
//Start the server
app.listen(3000, () => {
    console.log(`Servidor en el puerto ${3000}`);
});
