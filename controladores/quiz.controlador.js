// controladores/quiz.controlador.js (ATUALIZADO)
const { buscarUsuarioPorId, atualizarPontosUsuario } = require('../banco-dados/conexao');
const { quizzes, listarTodosQuizzes, buscarQuizPorId, buscarPerguntasDoQuiz, verificarResposta } = require('../dados');

const quizController = {
    // 1. Página inicial dos quizzes - mostra todos os quizzes disponíveis
    mostrarListaQuizzes: (req, res) => {
        if (!req.session.usuarioId) {
            return res.redirect('/login?erro=Faça login para acessar os quizzes');
        }
        
        const todosQuizzes = listarTodosQuizzes();
        
        res.render('lista_quizzes', {
            title: 'Quizzes - Brasil Selvagem',
            usuario: req.session.usuario || null,
            quizzes: todosQuizzes,
            mensagem: null,
            erro: null
        });
    },
    
    // 2. Mostrar um quiz específico
    mostrarQuiz: (req, res) => {
        if (!req.session.usuarioId) {
            return res.redirect('/login?erro=Faça login para acessar o quiz');
        }
        
        const quizId = req.params.quizId;
        const quiz = buscarQuizPorId(quizId);
        
        if (!quiz) {
            return res.render('quiz', {
                title: 'Quiz Não Encontrado',
                usuario: req.session.usuario || null,
                mensagem: null,
                erro: 'Quiz não encontrado!',
                perguntas: [],
                quiz: null
            });
        }
        
        // Selecionar perguntas aleatórias
        const perguntasSelecionadas = buscarPerguntasDoQuiz(quizId, 5);
        
        res.render('quiz', {
            title: `${quiz.titulo} - Quiz`,
            usuario: req.session.usuario || null,
            mensagem: `Teste seus conhecimentos sobre ${quiz.titulo.toLowerCase()}!`,
            erro: null,
            quiz: quiz,
            perguntas: perguntasSelecionadas,
            usuarioPontos: req.session.usuarioPontos || 0
        });
    },
    
    // 3. Processar respostas do quiz (AGORA COM ID DO QUIZ)
    processarRespostas: async (req, res) => {
        if (!req.session.usuarioId) {
            return res.redirect('/login');
        }
        
        const quizId = req.params.quizId;
        const quiz = buscarQuizPorId(quizId);
        
        if (!quiz) {
            return res.redirect('/quizzes');
        }
        
        console.log(`📝 Processando respostas do quiz "${quiz.titulo}" para:`, req.session.usuarioNome);
        
        const respostasUsuario = req.body.respostas || {};
        let totalAcertos = 0;
        let totalPontos = 0;
        let resultados = [];
        
        // Verificar cada resposta
        Object.keys(respostasUsuario).forEach(chave => {
            // Formato da chave: "pergunta_X" onde X é o ID da pergunta
            const perguntaId = parseInt(chave.replace('pergunta_', ''));
            const respostaUsuario = parseInt(respostasUsuario[chave]);
            
            const verificacao = verificarResposta(quizId, perguntaId, respostaUsuario);
            
            if (verificacao) {
                // Encontrar a pergunta completa para mais informações
                const pergunta = quiz.perguntas.find(p => p.id === perguntaId);
                
                resultados.push({
                    pergunta: pergunta.pergunta,
                    respostaUsuario: pergunta.opcoes[respostaUsuario] || 'Não respondida',
                    respostaCorreta: pergunta.opcoes[verificacao.respostaCorreta],
                    explicacao: verificacao.explicacao,
                    acertou: verificacao.acertou,
                    pontos: verificacao.pontos
                });
                
                if (verificacao.acertou) {
                    totalAcertos++;
                    totalPontos += verificacao.pontos;
                }
            }
        });
        
        // Atualizar pontos do usuário no banco
        if (totalPontos > 0) {
            buscarUsuarioPorId(req.session.usuarioId, (erro, usuario) => {
                if (erro) {
                    console.error('❌ Erro ao buscar usuário:', erro);
                } else if (usuario) {
                    const novosPontos = (usuario.pontos || 0) + totalPontos;
                    
                    atualizarPontosUsuario(usuario.id, novosPontos, (erroUpdate) => {
                        if (erroUpdate) {
                            console.error('❌ Erro ao atualizar pontos:', erroUpdate);
                        } else {
                            console.log(`✅ Pontos atualizados: ${usuario.nome} agora tem ${novosPontos} pontos`);
                            req.session.usuarioPontos = novosPontos;
                        }
                    });
                }
            });
        }
        
        // Calcular porcentagem de acertos
        const porcentagemAcertos = resultados.length > 0 
            ? Math.round((totalAcertos / resultados.length) * 100) 
            : 0;
        
        // Determinar mensagem baseada no desempenho
        let mensagemDesempenho = '';
        let emojiDesempenho = '📊';
        
        if (porcentagemAcertos >= 80) {
            mensagemDesempenho = '🎉 Excelente! Você é um expert!';
            emojiDesempenho = '🏆';
        } else if (porcentagemAcertos >= 60) {
            mensagemDesempenho = '👍 Muito bom! Você conhece bem o assunto!';
            emojiDesempenho = '⭐';
        } else if (porcentagemAcertos >= 40) {
            mensagemDesempenho = '😊 Bom trabalho! Continue aprendendo!';
            emojiDesempenho = '👍';
        } else {
            mensagemDesempenho = '📚 Estude um pouco mais e tente novamente!';
            emojiDesempenho = '📚';
        }
        
        // Salvar resultados na sessão
        req.session.resultadosQuiz = {
            quizId: quizId,
            quizTitulo: quiz.titulo,
            quizIcon: quiz.icon,
            totalAcertos,
            totalPontos,
            totalPerguntas: resultados.length,
            porcentagemAcertos,
            mensagemDesempenho,
            emojiDesempenho,
            data: new Date().toLocaleString()
        };
        
        console.log(`📊 Resultados: ${totalAcertos}/${resultados.length} acertos (${porcentagemAcertos}%) - ${totalPontos} pontos`);
        
        // Redirecionar para página de resultados
        res.redirect(`/quiz/${quizId}/resultado`);
    },
    
    // 4. Mostrar resultados do quiz (AGORA COM ID DO QUIZ)
    mostrarResultado: (req, res) => {
        if (!req.session.usuarioId) {
            return res.redirect('/login');
        }
        
        const quizId = req.params.quizId;
        const resultados = req.session.resultadosQuiz || {
            quizTitulo: 'Quiz',
            quizIcon: '📊',
            totalAcertos: 0,
            totalPontos: 0,
            totalPerguntas: 0,
            porcentagemAcertos: 0,
            mensagemDesempenho: 'Nenhum quiz realizado ainda.',
            emojiDesempenho: '📊',
            data: 'Não disponível'
        };
        
        // Verificar se os resultados são do quiz correto
        if (resultados.quizId && resultados.quizId !== quizId) {
            return res.redirect(`/quiz/${quizId}`);
        }
        
        res.render('quiz_resultado', {
            title: `Resultado - ${resultados.quizTitulo}`,
            usuario: req.session.usuario || null,
            resultados: resultados,
            emojiDesempenho: resultados.emojiDesempenho,
            usuarioPontos: req.session.usuarioPontos || 0
        });
    },
    
    // 5. Estatísticas gerais do usuário
    mostrarEstatisticas: (req, res) => {
        if (!req.session.usuarioId) {
            return res.redirect('/login');
        }
        
        buscarUsuarioPorId(req.session.usuarioId, (erro, usuario) => {
            if (erro) {
                console.error('❌ Erro ao buscar estatísticas:', erro);
                return res.redirect('/perfil');
            }
            
            // Determinar nível baseado nos pontos
            let nivel = 'Iniciante 🐣';
            let proximoNivel = 100;
            
            if (usuario.pontos >= 500) {
                nivel = 'Mestre 🐆';
                proximoNivel = 'Máximo';
            } else if (usuario.pontos >= 300) {
                nivel = 'Avançado 🦅';
                proximoNivel = 500;
            } else if (usuario.pontos >= 100) {
                nivel = 'Intermediário 🐦';
                proximoNivel = 300;
            } else {
                proximoNivel = 100;
            }
            
            res.render('quiz_estatisticas', {
                title: 'Minhas Estatísticas',
                usuario: usuario,
                nivel: nivel,
                proximoNivel: proximoNivel,
                totalQuizzes: Object.keys(quizzes).length,
                quizzesDisponiveis: listarTodosQuizzes()
            });
        });
    }
};

module.exports = quizController;