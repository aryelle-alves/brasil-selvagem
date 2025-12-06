// dados/index.js - VERSÃO COMPLETA
const animaisAmeacados = require('./quizzes/animais-ameacados');
const biomas = require('./quizzes/biomas');
const faunaBrasileira = require('./quizzes/fauna-brasileira');

const quizzes = {
    'fauna-brasileira': faunaBrasileira,
    'biomas': biomas,
    'animais-ameacados': animaisAmeacados
};

module.exports = {
    quizzes,
    
    // Função para listar todos os quizzes
    listarTodosQuizzes: () => {
        return Object.values(quizzes);
    },
    
    // Função para buscar quiz por ID
    buscarQuizPorId: (quizId) => {
        return quizzes[quizId];
    },
    
    // Função para buscar perguntas do quiz (ADICIONE ESTA)
    buscarPerguntasDoQuiz: (quizId, limite = 5) => {
        const quiz = quizzes[quizId];
        if (!quiz || !quiz.perguntas) return [];
        
        // Se não houver limite ou se houver menos perguntas que o limite, retorna todas
        if (!limite || quiz.perguntas.length <= limite) {
            return quiz.perguntas;
        }
        
        // Retorna um número limitado de perguntas
        // Pode ser aleatório se quiser: 
        // return [...quiz.perguntas].sort(() => 0.5 - Math.random()).slice(0, limite);
        return quiz.perguntas.slice(0, limite);
    },
    
    // Função para verificar resposta (ADICIONE ESTA)
    verificarResposta: (quizId, perguntaId, respostaUsuario) => {
        const quiz = quizzes[quizId];
        if (!quiz) return null;
        
        const pergunta = quiz.perguntas.find(p => p.id === perguntaId);
        if (!pergunta) return null;
        
        const acertou = respostaUsuario === pergunta.respostaCorreta;
        
        return {
            acertou: acertou,
            respostaCorreta: pergunta.respostaCorreta,
            explicacao: pergunta.explicacao || '',
            pontos: acertou ? 10 : 0
        };
    }
};