// dados/biomas.js
module.exports = {
    id: 'biomas',
    titulo: 'Biomas Brasileiros',
    descricao: 'Conheça os 6 biomas do Brasil e suas características',
    categoria: 'Ecologia',
    dificuldade: 'Fácil',
    cor: '#059669',
    icon: '🌳',
    perguntas: [
        {
            id: 1,
            pergunta: "Qual é o maior bioma brasileiro?",
            opcoes: ["Cerrado", "Mata Atlântica", "Amazônia", "Pantanal"],
            respostaCorreta: 2,
            explicacao: "A Amazônia cobre cerca de 49% do território brasileiro.",
            pontos: 10,
            dificuldade: "Fácil"
        },
        {
            id: 2,
            pergunta: "Qual bioma é conhecido como 'pulmão do mundo'?",
            opcoes: ["Cerrado", "Mata Atlântica", "Amazônia", "Caatinga"],
            respostaCorreta: 2,
            explicacao: "A Amazônia produz 20% do oxigênio do planeta.",
            pontos: 10,
            dificuldade: "Fácil"
        },
        {
            id: 3,
            pergunta: "Em qual bioma encontramos o 'cerradão'?",
            opcoes: ["Amazônia", "Cerrado", "Mata Atlântica", "Caatinga"],
            respostaCorreta: 1,
            explicacao: "O cerradão é uma formação florestal do bioma Cerrado.",
            pontos: 15,
            dificuldade: "Médio"
        }
    ]
};