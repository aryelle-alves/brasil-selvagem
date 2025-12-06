// app.js - ATUALIZE a configuração da sessão
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

// Servir arquivos estáticos
aplicativo.use('/css', express.static(path.join(__dirname, 'views/css-2')));

// ============================================
// CONFIGURAÇÃO DA SESSÃO - CORRIGIDA
// ============================================
aplicativo.use(session({
    secret: 'chave-secreta-brasil-selvagem-2025',
    resave: true,           // Mude para true
    saveUninitialized: true, // Mude para true
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    }
}));


// ============================================
// MIDDLEWARE DE DEBUG - Adicione isso
// ============================================
aplicativo.use((req, res, next) => {
    console.log('\n=== DEBUG SESSÃO ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('URL:', req.url);
    console.log('====================\n');
    next();
});

// Middleware para variáveis globais
aplicativo.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.mensagem = req.session.mensagem;
    res.locals.erro = req.session.erro;
    
    // Limpa as mensagens após usar
    delete req.session.mensagem;
    delete req.session.erro;
    
    next();
});

module.exports = { aplicativo, PORTA };