module.exports = function(req, res, next) {
    // PRIMEIRO: Garantir que usuarioId existe se usuario existe
    if (req.session && req.session.usuario && req.session.usuario.id) {
        req.session.usuarioId = req.session.usuario.id;
        console.log('🔄 SETANDO usuarioId para:', req.session.usuarioId);
    }
    
    // DEPOIS verificar
    if (req.session && (req.session.usuarioId || req.session.usuario)) {
        console.log('✅ Usuário autenticado - usuarioId:', req.session.usuarioId, 'usuario:', req.session.usuario?.id);
        next();
    } else {
        console.log('🔒 Acesso negado - Sem autenticação');
        req.session.erro = 'Faça login para acessar esta página';
        res.redirect('/login');
    }
};