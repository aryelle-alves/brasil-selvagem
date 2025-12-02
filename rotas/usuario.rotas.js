const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuario.controlador');
const authMiddleware = require('../intermediarios/autenticacao.intermediario');

// Todas requerem autenticação
router.get('/perfil', authMiddleware, usuarioController.mostrarPerfil);
router.get('/perfil/editar', authMiddleware, usuarioController.mostrarEdicaoPerfil);
router.post('/perfil/atualizar', authMiddleware, usuarioController.atualizarPerfil);
router.post('/perfil/deletar', authMiddleware, usuarioController.deletarConta);

module.exports = router;