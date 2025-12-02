// rotas/index.js
const express = require('express');
const router = express.Router();

// Importar todas as rotas
const autenticacaoRotas = require('./autenticacao.rotas');
const usuarioRotas = require('./usuario.rotas');
const paginasRotas = require('./paginas.rotas');
const quizRotas = require('./quiz.rotas');

// Agrupar rotas
router.use('/', paginasRotas);      // Páginas públicas
router.use('/', autenticacaoRotas); // Autenticação
router.use('/', usuarioRotas);      // Usuário
router.use('/', quizRotas);         // Quiz

module.exports = router;