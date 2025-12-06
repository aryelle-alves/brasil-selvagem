// rotas/index.js
const express = require('express');
const router = express.Router();

// Importar todas as rotas
const autenticacaoRotas = require('./autenticacao.rotas');
const usuarioRotas = require('./usuario.rotas');
const paginasRotas = require('./paginas.rotas');
const quizRotas = require('./quiz.rotas');

// Agrupar rotas - ORDEM É CRÍTICA!
// 1. Primeiro rotas específicas com parâmetros (:quizId)
// 2. Depois rotas gerais

router.use('/', quizRotas);         // Quiz - COLOCAR PRIMEIRO
router.use('/', paginasRotas);      // Páginas públicas
router.use('/', autenticacaoRotas); // Autenticação
router.use('/', usuarioRotas);      // Usuário

module.exports = router;