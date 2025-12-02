// intermediarios/autenticacao.intermediario.js
module.exports = function(req, res, next) {
    if (req.session && req.session.usuarioId) {
        // Usuário autenticado, continuar
        next();
    } else {
        // Não autenticado, redirecionar para login
        console.log('🔒 Acesso negado - Usuário não autenticado');
        res.redirect('/login?erro=Faça login para acessar esta página');
    }
};