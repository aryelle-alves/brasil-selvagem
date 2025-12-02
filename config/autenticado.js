module.exports = function(req, res, next) {
    // Verificar se usuário está logado
    if (req.session.usuarioId) {
        // Usuário autenticado, continuar
        next();
    } else {
        // Não autenticado, redirecionar para login
        res.redirect('/login');
    }
};