const seguranca = require('../config/seguranca');
const { inserirUsuario, buscarUsuarioPorEmail } = require('../banco-dados/conexao');

module.exports = {
    mostrarLogin: (req, res) => {
        res.render('login', {
            titulo: 'Login',
            erro: req.query.erro || null
        });
    },

    processarLogin: async (req, res) => {
        console.log('🔐 Tentativa de login:', req.body.email);
        
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.render('login', {
                titulo: 'Login',
                erro: 'Email e senha são obrigatórios!'
            });
        }
        
        buscarUsuarioPorEmail(email, async (erro, usuario) => {
            if (erro) {
                console.error('❌ Erro ao buscar usuário:', erro);
                return res.render('login', {
                    titulo: 'Login',
                    erro: 'Erro no servidor. Tente novamente!'
                });
            }
            
            if (!usuario) {
                console.log('❌ Usuário não encontrado:', email);
                return res.render('login', {
                    titulo: 'Login',
                    erro: 'Email ou senha incorretos!'
                });
            }
            
            try {
                const senhaValida = await seguranca.verificarSenha(senha, usuario.senha_hash);
                
                if (!senhaValida) {
                    console.log('❌ Senha incorreta para:', email);
                    return res.render('login', {
                        titulo: 'Login',
                        erro: 'Email ou senha incorretos!'
                    });
                }
                
                // Criar sessão
                req.session.usuarioId = usuario.id;
                req.session.usuarioNome = usuario.nome;
                req.session.usuarioEmail = usuario.email;
                req.session.usuarioPontos = usuario.pontos || 0;
                
                res.redirect('/perfil');
            } catch (erroVerificacao) {
                console.error('❌ Erro ao verificar senha:', erroVerificacao);
                res.render('login', {
                    titulo: 'Login',
                    erro: 'Erro ao verificar credenciais!'
                });
            }
        });
    },

    mostrarRegistro: (req, res) => {
        res.render('registro', {
            titulo: 'Registro',
            erro: req.query.erro || null
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
                titulo: 'Registro',
                erro: 'Todos os campos são obrigatórios!'
            });
        }
        
        if (!seguranca.validarEmail(email)) {
            return res.render('registro', {
                titulo: 'Registro',
                erro: 'Email inválido! Use formato: exemplo@email.com'
            });
        }
        
        buscarUsuarioPorEmail(email, async (erro, usuarioExistente) => {
            if (erro) {
                console.error('❌ Erro ao buscar usuário:', erro);
                return res.render('registro', {
                    titulo: 'Registro',
                    erro: 'Erro no servidor. Tente novamente!'
                });
            }
            
            if (usuarioExistente) {
                return res.render('registro', {
                    titulo: 'Registro',
                    erro: 'Este email já está cadastrado!'
                });
            }
            
            try {
                const senhaHash = await seguranca.hashSenha(senha);
                console.log('✅ Hash criado para:', email);
                
                inserirUsuario(nome, email, senhaHash, (erroInserir, usuarioId) => {
                    if (erroInserir) {
                        console.error('❌ Erro ao inserir usuário:', erroInserir);
                        return res.render('registro', {
                            titulo: 'Registro',
                            erro: 'Erro ao criar conta. Tente novamente!'
                        });
                    }
                    
                    console.log('✅ Usuário criado com ID:', usuarioId);
                    
                    // Criar sessão
                    req.session.usuarioId = usuarioId;
                    req.session.usuarioNome = nome;
                    req.session.usuarioEmail = email;
                    req.session.usuarioPontos = 0;
                    
                    res.redirect('/perfil');
                });
            } catch (erroHash) {
                console.error('❌ Erro no hash:', erroHash);
                res.render('registro', {
                    titulo: 'Registro',
                    erro: 'Erro ao processar senha. Tente novamente!'
                });
            }
        });
    },

    processarLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};