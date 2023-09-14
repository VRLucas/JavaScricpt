require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');


mongoose.connect(process.env.CONNECTSTRING,{useNewUrlParser: true, useUnifiedTopology:true}).then(() => { 
    console.log('Banco de Dados Conectado');
    app.emit('pronto') }).catch(e => console.log(`Banco de dados não conector ${e}`));

const session = require('express-session');

const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const route = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal,checkCsrfError,csrfMiddleware} = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

app.use(csrf());
// Meus próprios middleware
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Rotas
app.use(route);

// Para rodar aplicação
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acesse: http://localhost:3000');
        console.log('Servidor Executando na Porta 3000');
    });

})
