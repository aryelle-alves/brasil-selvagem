const express = require('express');
const session = require('express-session');
const path = require('path');

// Conexão com banco de dados
const banco = require('./banco-dados/conexao');

const aplicativo = express();
const PORTA = 3000;

// Configuração do EJS
aplicativo.set('view engine', 'ejs');
aplicativo.set('views', path.join(__dirname, 'views'));

// Middlewares
aplicativo.use(express.urlencoded({ extended: true }));
aplicativo.use(express.json());
aplicativo.use(express.static('public'));

// Configuração de sessões
aplicativo.use(session({
    secret: 'chave-secreta-brasil-selvagem-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// Rotas principais
aplicativo.get('/', (requisicao, resposta) => {
    resposta.render('index', { 
        titulo: 'Brasil Selvagem',
        mensagem: 'Bem-vindo à plataforma!'
    });
});

aplicativo.get('/login', (requisicao, resposta) => {
    resposta.render('login', { titulo: 'Login' });
});

aplicativo.get('/register', (requisicao, resposta) => {
    resposta.render('register', { titulo: 'Registro' });
});

// Rota de teste
aplicativo.get('/teste', (requisicao, resposta) => {
    resposta.send('✅ Servidor funcionando perfeitamente!');
});

// Iniciar servidor
aplicativo.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log('📁 Rotas disponíveis:');
    console.log('   http://localhost:3000');
    console.log('   http://localhost:3000/login');
    console.log('   http://localhost:3000/register');
    console.log('   http://localhost:3000/teste');
});