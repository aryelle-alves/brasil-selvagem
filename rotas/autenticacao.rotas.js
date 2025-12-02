const express = require('express');
const router = express.Router();
const autenticacaoController = require('../controladores/autenticacao.controlador');

// ROTAS
router.get('/login', autenticacaoController.mostrarLogin);
router.post('/login', autenticacaoController.processarLogin);
router.get('/registro', autenticacaoController.mostrarRegistro);
router.post('/registro', autenticacaoController.processarRegistro);
router.get('/logout', autenticacaoController.processarLogout);

module.exports = router;