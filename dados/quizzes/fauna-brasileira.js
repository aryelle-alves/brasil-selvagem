// Exemplo: dados/quizzes/fauna-brasileira.js
module.exports = {
    id: 'fauna-brasileira',
    titulo: 'Fauna Brasileira',
    descricao: 'Teste seus conhecimentos sobre animais do Brasil',
    categoria: 'Animais',
    dificuldade: 'Média',
    cor: '#22c55e',
    icon: '🐆',
    perguntas: [
        {
            id: 1,
            pergunta: "Qual é o maior felino das Américas?",
            opcoes: ["Leão", "Puma", "Onça-pintada", "Jaguatirica"],
            respostaCorreta: 2,
            explicacao: "A onça-pintada é o maior felino das Américas.",
            pontos: 10,
            dificuldade: "Fácil"
        },
        // ... mais perguntas
    ]
};