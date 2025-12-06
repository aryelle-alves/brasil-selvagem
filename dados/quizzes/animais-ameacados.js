// dados/animais-ameacados.js (ATUALIZADO)
module.exports = {
    id: 'animais-ameacados',
    titulo: 'Animais Ameaçados',
    descricao: 'Conheça animais em risco de extinção no Brasil',
    categoria: 'Conservação',
    dificuldade: 'Difícil',
    cor: '#dc2626',
    icon: '🆘',
    perguntas: [
        {
            id: 1,
            pergunta: "Qual destes animais está criticamente ameaçado?",
            opcoes: ["Ararinha-azul", "Capivara", "Quati", "Tatu-bola"],
            respostaCorreta: 0,
            explicacao: "A ararinha-azul está extinta na natureza desde 2000.",
            pontos: 20,
            dificuldade: "Difícil"
        },
        {
            id: 2,
            pergunta: "Onde vive o muriqui-do-norte?",
            opcoes: ["Amazônia", "Mata Atlântica", "Cerrado", "Pantanal"],
            respostaCorreta: 1,
            explicacao: "Restam apenas cerca de 800 indivíduos na Mata Atlântica.",
            pontos: 20,
            dificuldade: "Difícil"
        }
        
    ]
};