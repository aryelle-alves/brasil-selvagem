const bcrypt = require('bcryptjs');

module.exports = {
    // ✅ Função 1: Criar hash da senha
    async hashSenha(senha) {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(senha, salt);
        } catch (erro) {
            console.error('❌ Erro ao criar hash:', erro);
            throw erro;
        }
    },

    // ✅ Função 2: Verificar senha (NOTA: vírgula após a função!)
    async verificarSenha(senhaDigitada, senhaHash) {
        try {
            return await bcrypt.compare(senhaDigitada, senhaHash);
        } catch (erro) {
            console.error('❌ Erro ao verificar senha:', erro);
            return false;
        }
    }, // ⬅️ IMPORTANTE: Esta vírgula é necessária!

    // ✅ Função 3: Validar email
    validarEmail(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    // ⬅️ NÃO coloque vírgula aqui no final (última função)
};