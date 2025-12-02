const express = require('express');
const router = express.Router();
const { buscarUsuarioPorId } = require('../banco-dados/conexao');

// Página inicial
router.get('/', (req, res) => {
    const dados = {
        titulo: 'Brasil Selvagem',
        mensagem: 'Bem-vindo à nossa plataforma!', 
    };
    
    if (req.session.usuarioId) {
        buscarUsuarioPorId(req.session.usuarioId, (erro, usuario) => {
            if (usuario) {
                dados.usuario = {
                    nome: usuario.nome,
                    nivel: usuario.nivel || 'Iniciante',
                    pontos: usuario.pontos || 0
                };
            }
            res.render('index', dados);
        });
    } else {
        res.render('index', dados);
    }
});

// Páginas públicas
router.get('/biomas', (req, res) => {
    res.render('biomas', {
        titulo: 'Biomas Brasileiros',
        mensagem: 'Conheça nossa fauna!'
    });
});

// Quiz (por enquanto público, depois proteger)
router.get('/quiz', (req, res) => {
    res.render('quiz', {
        titulo: 'Quiz - Fauna Brasileira',
        mensagem: 'Teste seus conhecimentos!'
    });
});

// Ranking (por enquanto público)
router.get('/ranking', (req, res) => {
    res.render('ranking', {
        titulo: 'Ranking',
        mensagem: 'Top 10 jogadores'
    });
});

module.exports = router;