// rotas/paginas.rotas.js
const express = require('express');
const router = express.Router();

// Importar função do banco de dados
const { buscarRankingUsuarios } = require('../banco-dados/conexao');

// Importar middleware compartilhado
const authMiddleware = require('../intermediarios/autenticacao.intermediario');

// ============================================
// ROTAS PÚBLICAS (não precisam de login)
// ============================================

// Rota principal
router.get('/', (req, res) => {
    res.render('index-completo', {
        title: 'Brasil Selvagem - Início',
        usuario: req.session.usuario || null,
        mensagem: null,
        erro: null
    });
});

// Ranking (público)
router.get('/ranking', (req, res) => {
    buscarRankingUsuarios((erro, ranking) => {
        res.render('ranking', {
            title: 'Ranking - Brasil Selvagem',
            usuario: req.session.usuario || null,
            mensagem: null,
            erro: null,
            ranking: ranking || []
        });
    });
});

// Biomas (público)
router.get('/biomas', (req, res) => {
    res.render('biomas', {
        title: 'Biomas - Brasil Selvagem',
        usuario: req.session.usuario || null,
        mensagem: null,
        erro: null
    });
});

// ============================================
// ROTAS PROTEGIDAS (precisam de login)
// ============================================

// Perfil
router.get('/perfil', authMiddleware, (req, res) => {
    res.render('perfil', {
        title: 'Meu Perfil - Brasil Selvagem',
        usuario: req.session.usuario
    });
});

// Editar perfil
router.get('/perfil/editar', authMiddleware, (req, res) => {
    res.render('perfil_editar', {
        title: 'Editar Perfil - Brasil Selvagem',
        usuario: req.session.usuario,
        mensagem: null,
        erro: null,
        sucesso: null
    });
});

// ============================================
// ROTA DE TESTE
// ============================================

router.get('/teste', (req, res) => {
    res.send(`
        <h1>Teste OK</h1>
        <p>Servidor está funcionando!</p>
        <p>Sessão ID: ${req.session.usuarioId || 'Nenhum'}</p>
        <p>Sessão Usuário: ${JSON.stringify(req.session.usuario || {})}</p>
        <a href="/">Voltar para home</a>
    `);
});

router.get('/sessao-info', (req, res) => {
    res.json({
        usuarioId: req.session.usuarioId,
        usuario: req.session.usuario,
        usuarioIdDoUsuario: req.session.usuario?.id,
        todasChaves: Object.keys(req.session)
    });
});

module.exports = router;