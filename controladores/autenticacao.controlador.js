const seguranca = require('../config/seguranca');
const { inserirUsuario, buscarUsuarioPorEmail } = require('../banco-dados/conexao');

module.exports = {
    mostrarLogin: (req, res) => {
        res.render('login', {
            title: 'Login - Brasil Selvagem',
            usuario: req.session.usuario || null,
            erro: req.query.erro || null,
            sucesso: req.query.sucesso || null
        });
    },

    processarLogin: async (req, res) => {
        console.log('🔐 Tentativa de login:', req.body.email);
        
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.render('login', {
                title: 'Login - Brasil Selvagem',
                usuario: null,
                erro: 'Email e senha são obrigatórios!',
                sucesso: null
            });
        }
        
        buscarUsuarioPorEmail(email, async (erro, usuario) => {
            if (erro) {
                console.error('❌ Erro ao buscar usuário:', erro);
                return res.render('login', {
                    title: 'Login - Brasil Selvagem',
                    usuario: null,
                    erro: 'Erro no servidor. Tente novamente!',
                    sucesso: null
                });
            }
            
            if (!usuario) {
                console.log('❌ Usuário não encontrado:', email);
                return res.render('login', {
                    title: 'Login - Brasil Selvagem',
                    usuario: null,
                    erro: 'Email ou senha incorretos!',
                    sucesso: null
                });
            }
            
            try {
                const senhaValida = await seguranca.verificarSenha(senha, usuario.senha_hash);
                
                if (!senhaValida) {
                    console.log('❌ Senha incorreta para:', email);
                    return res.render('login', {
                        title: 'Login - Brasil Selvagem',
                        usuario: null,
                        erro: 'Email ou senha incorretos!',
                        sucesso: null
                    });
                }
                
                // Criar objeto de sessão
                req.session.usuario = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    pontos: usuario.pontos || 0,
                    nivel: usuario.nivel || 'Iniciante',
                    ranking: usuario.ranking || null
                };
                req.session.usuarioId = usuario.id;

                // SALVAR A SESSÃO EXPLICITAMENTE - NOVO CÓDIGO ADICIONADO
                req.session.save((err) => {
                    if (err) {
                        console.error('❌ Erro ao salvar sessão:', err);
                        return res.render('login', {
                            title: 'Login - Brasil Selvagem',
                            usuario: null,
                            erro: 'Erro ao iniciar sessão. Tente novamente.'
                        });
                    }
                    
                    console.log('✅ Login bem-sucedido - Sessão salva:', req.session.usuario.nome);
                    res.redirect('/perfil');
                });

            } catch (erroVerificacao) {
                console.error('❌ Erro ao verificar senha:', erroVerificacao);
                res.render('login', {
                    title: 'Login - Brasil Selvagem',
                    usuario: null,
                    erro: 'Erro ao verificar credenciais!',
                    sucesso: null
                });
            }
        });
    },

    mostrarRegistro: (req, res) => {
        res.render('registro', {
            title: 'Registrar - Brasil Selvagem',
            usuario: req.session.usuario || null,
            erro: req.query.erro || null,
            sucesso: req.query.sucesso || null
        });
    },

    processarRegistro: async (req, res) => {
        console.log('📝 Tentativa de registro:', {
            nome: req.body.nome,
            email: req.body.email,
            senha: '[PROTEGIDO]'
        });
        
        const { nome, email, senha } = req.body;
        
        if (!nome || !email || !senha) {
            return res.render('registro', {
                title: 'Registrar - Brasil Selvagem',
                usuario: null,
                erro: 'Todos os campos são obrigatórios!',
                sucesso: null
            });
        }
        
        if (!seguranca.validarEmail(email)) {
            return res.render('registro', {
                title: 'Registrar - Brasil Selvagem',
                usuario: null,
                erro: 'Email inválido! Use formato: exemplo@email.com',
                sucesso: null
            });
        }
        
        buscarUsuarioPorEmail(email, async (erro, usuarioExistente) => {
            if (erro) {
                console.error('❌ Erro ao buscar usuário:', erro);
                return res.render('registro', {
                    title: 'Registrar - Brasil Selvagem',
                    usuario: null,
                    erro: 'Erro no servidor. Tente novamente!',
                    sucesso: null
                });
            }
            
            if (usuarioExistente) {
                return res.render('registro', {
                    title: 'Registrar - Brasil Selvagem',
                    usuario: null,
                    erro: 'Este email já está cadastrado!',
                    sucesso: null
                });
            }
            
            try {
                const senhaHash = await seguranca.hashSenha(senha);
                console.log('✅ Hash criado para:', email);
                
                inserirUsuario(nome, email, senhaHash, (erroInserir, usuarioId) => {
                    if (erroInserir) {
                        console.error('❌ Erro ao inserir usuário:', erroInserir);
                        return res.render('registro', {
                            title: 'Registrar - Brasil Selvagem',
                            usuario: null,
                            erro: 'Erro ao criar conta. Tente novamente!',
                            sucesso: null
                        });
                    }
                    
                    console.log('✅ Usuário criado com ID:', usuarioId);
                    
                    // Criar objeto de sessão
                    req.session.usuario = {
                        id: usuarioId,
                        nome: nome,
                        email: email,
                        pontos: 0,
                        nivel: 'Iniciante',
                        ranking: null
                    };
                    req.session.usuarioId = usuarioId;
                    
                    // SALVAR A SESSÃO EXPLICITAMENTE - NOVO CÓDIGO ADICIONADO
                    req.session.save((err) => {
                        if (err) {
                            console.error('❌ Erro ao salvar sessão:', err);
                            return res.render('registro', {
                                title: 'Registrar - Brasil Selvagem',
                                usuario: null,
                                erro: 'Erro ao criar sessão. Tente novamente.'
                            });
                        }
                        
                        console.log('✅ Registro bem-sucedido - Sessão salva:', nome);
                        res.redirect('/perfil');
                    });
                });
            } catch (erroHash) {
                console.error('❌ Erro no hash:', erroHash);
                res.render('registro', {
                    title: 'Registrar - Brasil Selvagem',
                    usuario: null,
                    erro: 'Erro ao processar senha. Tente novamente!',
                    sucesso: null
                });
            }
        });
    },

    processarLogout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('❌ Erro ao fazer logout:', err);
            }
            res.redirect('/');
        });
    }
};