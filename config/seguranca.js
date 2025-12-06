const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
    // Hash de senha com bcrypt
    async hashSenha(senha) {
        try {
            const salt = await bcrypt.genSalt(12); // Aumentado para 12 rounds
            return await bcrypt.hash(senha, salt);
        } catch (erro) {
            console.error('❌ Erro ao criar hash:', erro);
            throw new Error('Erro ao processar senha');
        }
    },

    // Verificar senha
    async verificarSenha(senhaDigitada, senhaHash) {
        try {
            return await bcrypt.compare(senhaDigitada, senhaHash);
        } catch (erro) {
            console.error('❌ Erro ao verificar senha:', erro);
            return false;
        }
    },

    // Validar email robusto
    validarEmail(email) {
        if (!email || typeof email !== 'string') return false;
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email.trim());
    },

    // Validar senha forte
    validarSenhaForte(senha) {
        if (!senha || typeof senha !== 'string') return false;
        
        // Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula, 1 número
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(senha);
    },

    // Sanitizar entrada (proteção básica XSS)
    sanitizarEntrada(texto) {
        if (typeof texto !== 'string') return '';
        
        return texto
            .trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    // Validar nome (prevenção de injeção)
    validarNome(nome) {
        if (!nome || typeof nome !== 'string') return false;
        
        const nomeLimpo = nome.trim();
        
        // Verificar comprimento
        if (nomeLimpo.length < 2 || nomeLimpo.length > 100) return false;
        
        // Permitir apenas letras, espaços e alguns caracteres especiais comuns em nomes
        const regex = /^[a-zA-ZÀ-ú\s'-]+$/;
        return regex.test(nomeLimpo);
    },

    // Gerar token CSRF (simples)
    gerarTokenCSRF() {
        return crypto.randomBytes(32).toString('hex');
    },

    // Validar token CSRF
    validarTokenCSRF(tokenRecebido, tokenEsperado) {
        if (!tokenRecebido || !tokenEsperado) return false;
        return crypto.timingSafeEqual(
            Buffer.from(tokenRecebido),
            Buffer.from(tokenEsperado)
        );
    },

    // Validar URL (para redirecionamentos seguros)
    validarURL(url) {
        try {
            const parsed = new URL(url);
            // Permitir apenas URLs internas
            return parsed.origin === 'http://localhost:3000' || 
                   parsed.origin === 'https://seusite.com'; // Altere para seu domínio
        } catch {
            return false;
        }
    },

    // Rate limiting simples (implementação básica)
    criarLimiter() {
        const tentativas = new Map();
        
        return {
            verificar(ip, limite = 10, janela = 15 * 60 * 1000) { // 10 tentativas em 15 minutos
                const agora = Date.now();
                const registro = tentativas.get(ip) || { count: 0, resetTime: agora + janela };
                
                if (agora > registro.resetTime) {
                    // Resetar contador
                    registro.count = 1;
                    registro.resetTime = agora + janela;
                } else {
                    registro.count++;
                }
                
                tentativas.set(ip, registro);
                return registro.count <= limite;
            },
            
            limparAntigos() {
                const agora = Date.now();
                for (const [ip, registro] of tentativas.entries()) {
                    if (agora > registro.resetTime) {
                        tentativas.delete(ip);
                    }
                }
            }
        };
    }
};