const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Image = require('../models/Servicios');
const storage = require('../multer')
const {unlink} = require('fs-extra');
const path = require('path');
const multer = require('multer');

const uploader = multer({
    storage
}).single('file');

router.post('/registro', async (req, res) =>{
    const {nombre, edad, carrera, email, password} = req.body;
    const newUser = new User({nombre, edad, carrera, email, password});
    await newUser.save();

    const token = jwt.sign({_id: newUser._id}, 'secretkey');
    res.json({token});

})

router.post('/login', async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).send("El correo no existe");
    if (user.password !== password) return res.status(401).send("Contraseña Incorrecta");

    const token = jwt.sign({_id: user._id}, 'secretkey');
    return res.status(200).json({token});
})

router.get('/public', (req, res) =>{
    res.json([
    {
        _id:1,
        name: 'Tarea 1',
        descripcion: 'lorem ipsum',
        date: '2023-01-24T04:40:40.029+00:00'

    },
    {
        _id:2,
        name: 'Tarea 2',
        descripcion: 'lorem ipsum',
        date: '2023-01-24T04:40:40.029+00:00'

    },
    {
        _id:3,
        name: 'Tarea 3',
        descripcion: 'lorem ipsum',
        date: '2023-01-24T04:40:40.029+00:00'

    }
    ])
});

router.get('/private', verifyToken, (req, res) => {
    res.json([
        {
            _id: '1',
            name: "task one",
            description: 'asdadasd',
            date: "2019-11-06T15:50:18.921Z"
        },
        {
            _id: '2',
            name: "task two",
            description: 'asdadasd',
            date: "2019-11-06T15:50:18.921Z"
        },
        {
            _id: '3',
            name: "task three",
            description: 'asdadasd',
            date: "2019-11-06T15:50:18.921Z"
        },
    ])
});

router.get('/all', verifyToken, (req, res)=> {
    res.send(req.userId);

})

router.post('/upload', uploader, async(req, res) =>{
    const {body, file } = req
    if(file && body){
        const newImage = new Image({
            nombre: body.nombre,
            fileurl: `http://localhost:3000/${file.filename}`
        });
        await newImage.save();
        res.json({
            newImage: newImage
        }) 
    }

});


router.get('/download', async(req,res) =>{
    const images = await Image.find();
    res.json(images);
})
/*router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index', {images});
});

router.get('/upload', (req, res) => {
    res.render('upload');
});

router.post('/upload', async (req, res) =>{
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    await image.save();

    res.redirect('/');
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    console.log(image);
    res.render('profile', {image});
});

router.get('/image/:id/delete', async (req, res) => {
    const {id} = req.params;
    const image = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + image.path));
    res.redirect('/');
});*/

function verifyToken(req, res, next){
    if (!req.headers.authorization){
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token == 'null'){
        return res.status(401).send("Solicitud no autorizada");
    }

    const comprobar = jwt.verify(token, 'secretkey')
    req.userId = comprobar._id;
    next();

};

module.exports = router;