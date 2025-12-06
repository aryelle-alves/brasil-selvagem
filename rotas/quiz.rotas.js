// rotas/quiz.rotas.js
const express = require('express');
const router = express.Router();
const quizController = require('../controladores/quiz.controlador');
const authMiddleware = require('../intermediarios/autenticacao.intermediario');

// ============================================
// ROTAS DO QUIZ (TODAS PROTEGIDAS)
// ============================================

// Rota de teste para debug
router.get('/teste-quiz', authMiddleware, (req, res) => {
    res.send(`
        <h1>✅ Rotas de Quiz funcionando!</h1>
        <p>Usuário: ${req.session.usuarioId || req.session.usuario?.id || 'N/A'}</p>
        <p><a href="/quizzes">Ir para lista de quizzes</a></p>
        <p><a href="/quiz/fauna-brasileira">Testar quiz específico</a></p>
        <p><a href="/">Voltar para home</a></p>
    `);
});

// Lista de quizzes disponíveis
router.get('/quizzes', authMiddleware, quizController.mostrarListaQuizzes);

// Página de um quiz específico
router.get('/quiz/:quizId', authMiddleware, quizController.mostrarQuiz);

// Processar respostas do quiz
router.post('/quiz/:quizId/responder', authMiddleware, quizController.processarRespostas);

// Mostrar resultado do quiz
router.get('/quiz/:quizId/resultado', authMiddleware, quizController.mostrarResultado);

// Redirecionamento para compatibilidade
router.get('/quiz', authMiddleware, (req, res) => {
    res.redirect('/quizzes');
});

module.exports = router;