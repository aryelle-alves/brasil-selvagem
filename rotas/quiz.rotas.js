const express = require('express');
const router = express.Router();
const quizController = require('../controladores/quiz.controlador');
const authMiddleware = require('../intermediarios/autenticacao.intermediario');

// Proteger quiz quando implementar
// router.get('/quiz', authMiddleware, quizController.mostrarQuiz);
// router.post('/quiz/resposta', authMiddleware, quizController.processarResposta);

// Por enquanto, deixar público
router.get('/quiz', quizController.mostrarQuiz);
router.post('/quiz/resposta', quizController.processarResposta);

module.exports = router;