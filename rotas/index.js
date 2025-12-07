const express = require('express');
const router = express.Router();

const autenticacaoRotas = require('./autenticacao.rotas');
const usuarioRotas = require('./usuario.rotas');
const paginasRotas = require('./paginas.rotas');
const quizRotas = require('./quiz.rotas');

router.use('/', quizRotas);         // Quiz 
router.use('/', paginasRotas);      // Páginas públicas
router.use('/', autenticacaoRotas); // Autenticação
router.use('/', usuarioRotas);      // Usuário

module.exports = router;