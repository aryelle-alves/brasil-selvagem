const rotas = require('./rotas');
aplicativo.use('/', rotas);

// INICIAR SERVIDOR
aplicativo.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log('📁 Estrutura:');
    console.log('   • /rotas/          - Rotas organizadas');
    console.log('   • /controladores/  - Controladores');
    console.log('   • /middlewares/    - Middlewares');
    console.log('   • /banco-dados/    - Banco de dados');
    console.log('   • /views/          - Templates EJS');
});

// -----------------------

// server.js
const { aplicativo, PORTA } = require('./app');

// Importar rotas
const rotas = require('./rotas');
aplicativo.use('/', rotas);

// Iniciar servidor
aplicativo.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log('\n🎯 Rotas disponíveis:');
    console.log('   • /                 - Página inicial');
    console.log('   • /login            - Login');
    console.log('   • /registro         - Registro');
    console.log('   • /perfil           - Perfil (requer login)');
    console.log('   • /perfil/editar    - Editar perfil');
    console.log('   • /quiz             - Quiz');
    console.log('   • /ranking          - Ranking');
    console.log('   • /biomas           - Biomas');
    console.log('   • /logout           - Logout');
});