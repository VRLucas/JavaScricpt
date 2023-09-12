require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');


mongoose.connect(process.env.CONNECTSTRING).then(() => { 
    console.log('Banco de Dados Conectado');
    app.emit('pronto') }).catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const route = require('./routes');
const path = require('path');
const { middlewareGlobal, outroMiddleware } = require('./src/middlewares/middleware');


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'texto seguro', // texto que usuario nao consegue ver.
    resave: false,
    store: MongoStore.create({mongoUrl: process.env.CONNECTSTRING}), 
    // para conectar as seçeõs com banco de dados.
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true}, // tempo que a seção dura.

});
app.use(sessionOptions); // para executar as seçeõs.
app.use(flash()); // para executar as FlashMensagens.


app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Meus próprios middleware
app.use(outroMiddleware);
app.use(middlewareGlobal);
// Rotas
app.use(route);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acesse: http://localhost:3000');
        console.log('Servidor Executando na Porta 3000');
    });

})
