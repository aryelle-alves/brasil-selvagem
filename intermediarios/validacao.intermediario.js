const seguranca = require('../config/seguranca');

module.exports = {
    validarRegistro: (req, res, next) => {
        const { nome, email, senha } = req.body;
        
        // Validar campos obrigatórios
        if (!nome || !email || !senha) {
            return res.status(400).render('registro', {
                titulo: 'Registro',
                erro: 'Todos os campos são obrigatórios!'
            });
        }
        
        // Validar nome
        if (!seguranca.validarNome(nome)) {
            return res.status(400).render('registro', {
                titulo: 'Registro',
                erro: 'Nome inválido. Use apenas letras, espaços e apóstrofos.'
            });
        }
        
        // Validar email
        if (!seguranca.validarEmail(email)) {
            return res.status(400).render('registro', {
                titulo: 'Registro',
                erro: 'Email inválido! Use formato: exemplo@email.com'
            });
        }
        
        // Validar senha forte
        if (!seguranca.validarSenhaForte(senha)) {
            return res.status(400).render('registro', {
                titulo: 'Registro',
                erro: 'Senha fraca! Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.'
            });
        }
    }
}
