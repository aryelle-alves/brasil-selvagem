// server.js
const { aplicativo, PORTA } = require('./app');

// IMPORTAR ROTAS CENTRALIZADAS
const rotas = require('./rotas'); // Isso importa o index.js

// USAR ROTAS
aplicativo.use('/', rotas);

// INICIAR SERVIDOR
aplicativo.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log('\n🎯 Rotas disponíveis:');
    console.log('   • /                 - Página inicial');
    console.log('   • /login            - Login');
    console.log('   • /registro         - Registro');
    console.log('   • /perfil           - Perfil (requer login)');
    console.log('   • /perfil/editar    - Editar perfil (requer login)');
    console.log('   • /quizzes          - Lista de quizzes (requer login)');
    console.log('   • /quiz/:quizId     - Quiz específico (requer login)');
    console.log('   • /ranking          - Ranking (público)');
    console.log('   • /biomas           - Biomas (público)');
    console.log('   • /logout           - Logout');
    console.log('   • /teste            - Página de teste');
    console.log('   • /teste-quiz       - Teste das rotas de quiz');
    console.log('\n📊 Banco de dados SQLite pronto!');
});