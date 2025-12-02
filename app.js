const express = require('express');
const session = require('express-session');
const path = require('path');

const aplicativo = express();
const PORTA = process.env.PORT || 3000;

// Configurações
aplicativo.set('view engine', 'ejs');
aplicativo.set('views', path.join(__dirname, 'views'));

// Middlewares
aplicativo.use(express.urlencoded({ extended: true }));
aplicativo.use(express.json());
aplicativo.use(express.static(path.join(__dirname, 'public')));

// Sessões
aplicativo.use(session({
    secret: 'chave-secreta-brasil-selvagem-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

module.exports = { aplicativo, PORTA };