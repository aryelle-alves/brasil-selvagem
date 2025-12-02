const { buscarUsuarioPorId, buscarUsuarioPorEmail, atualizarUsuario, deletarUsuario } = require('../banco-dados/conexao');
const seguranca = require('../config/seguranca');

module.exports = {
    mostrarPerfil: (req, res) => {
        buscarUsuarioPorId(req.session.usuarioId, (erro, usuario) => {
            if (erro) {
                console.error('❌ Erro ao buscar usuário:', erro);
                return res.render('perfil', {
                    titulo: 'Meu Perfil',
                    usuario: {
                        nome: req.session.usuarioNome || 'Usuário',
                        email: req.session.usuarioEmail || 'Não disponível',
                        nivel: 'Iniciante',
                        pontos: req.session.usuarioPontos || 0
                    },
                    query: req.query
                });
            }
            
            if (!usuario) {
                console.log('❌ Usuário não encontrado no banco');
                return res.redirect('/login?erro=Sessão inválida');
            }
            
            res.render('perfil', {
                titulo: 'Meu Perfil',
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email,
                    nivel: usuario.nivel || 'Iniciante',
                    pontos: usuario.pontos || 0
                },
                query: req.query
            });
        });
    },

    mostrarEdicaoPerfil: (req, res) => {
        buscarUsuarioPorId(req.session.usuarioId, (erro, usuario) => {
            if (erro || !usuario) {
                return res.redirect('/perfil?erro=Usuário não encontrado');
            }
            
            res.render('perfil_editar', {
                titulo: 'Editar Perfil',
                usuario: usuario,
                sucesso: req.query.sucesso,
                erro: req.query.erro
            });
        });
    },

    atualizarPerfil: (req, res) => {
        const { nome, email } = req.body;
        
        if (!nome || !email) {
            return res.redirect('/perfil/editar?erro=Todos os campos são obrigatórios');
        }
        
        if (!seguranca.validarEmail(email)) {
            return res.redirect('/perfil/editar?erro=Email inválido');
        }
        
        buscarUsuarioPorEmail(email, (erro, usuarioExistente) => {
            if (erro) {
                return res.redirect('/perfil/editar?erro=Erro ao verificar email');
            }
            
            if (usuarioExistente && usuarioExistente.id !== req.session.usuarioId) {
                return res.redirect('/perfil/editar?erro=Este email já está em uso');
            }
            
            atualizarUsuario(req.session.usuarioId, nome, email, (erroUpdate) => {
                if (erroUpdate) {
                    return res.redirect('/perfil/editar?erro=Erro ao atualizar perfil');
                }
                
                // Atualizar sessão
                req.session.usuarioNome = nome;
                req.session.usuarioEmail = email;
                
                res.redirect('/perfil?sucesso=Perfil atualizado com sucesso!');
            });
        });
    },

    deletarConta: (req, res) => {
        const { confirmacao } = req.body;
        
        if (confirmacao !== 'CONFIRMAR') {
            return res.redirect('/perfil?erro=Digite CONFIRMAR para deletar a conta');
        }
        
        deletarUsuario(req.session.usuarioId, (erro) => {
            if (erro) {
                return res.redirect('/perfil?erro=Erro ao deletar conta');
            }
            
            req.session.destroy();
            res.redirect('/?sucesso=Conta deletada com sucesso');
        });
    }
};