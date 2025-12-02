const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco
const caminhoBanco = path.join(__dirname, 'brasil-selvagem.db');

// Conectar ao banco
const banco = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error('❌ Erro ao conectar com banco:', erro.message);
    } else {
        console.log('✅ Conectado ao banco SQLite.');
        criarTabelas();
    }
});

function criarTabelas() {
    // Tabela de usuários
    banco.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        nivel TEXT DEFAULT 'Iniciante',
        pontos INTEGER DEFAULT 0,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (erro) => {
        if (erro) {
            console.error('❌ Erro criar tabela usuarios:', erro);
        } else {
            console.log('✅ Tabela usuarios criada/verificada');
        }
    });
}

// C - CREATE Usuário (nome, email, senha)
function inserirUsuario(nome, email, senhaHash, callback) {
    const sql = `INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)`;
    banco.run(sql, [nome, email, senhaHash], function(erro) {
        callback(erro, this.lastID);
    });
}

// R - READ Usuário (nome, email, senha)
function buscarUsuarioPorEmail(email, callback) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    banco.get(sql, [email], callback);
}

function buscarUsuarioPorId(id, callback) {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    banco.get(sql, [id], callback);
}

// U - UPDATE Usuário (nome, email, senha)
function atualizarUsuario(usuarioId, novoNome, novoEmail, callback) {
    const sql = `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?`;
    console.log('🔧 Atualizando usuário ID:', usuarioId, 'Para:', novoNome, novoEmail);
    
    banco.run(sql, [novoNome, novoEmail, usuarioId], function(erro) {
        if (erro) {
            console.error('❌ Erro ao atualizar usuário:', erro.message);
        } else {
            console.log('✅ Usuário atualizado. Mudanças:', this.changes);
        }
        callback(erro, this.changes);
    });
}

// D - DELETE Usuário
function deletarUsuario(usuarioId, callback) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    console.log('🗑️  Deletando usuário ID:', usuarioId);
    
    banco.run(sql, [usuarioId], function(erro) {
        if (erro) {
            console.error('❌ Erro ao deletar usuário:', erro.message);
        } else {
            console.log('✅ Usuário deletado. Mudanças:', this.changes);
        }
        callback(erro, this.changes);
    });
}

// ============================================
// EXPORTE TODAS AS FUNÇÕES
// ============================================
module.exports = {
    banco,
    inserirUsuario,      // CREATE
    buscarUsuarioPorEmail, // READ
    buscarUsuarioPorId,    // READ
    atualizarUsuario,    // UPDATE
    deletarUsuario       // DELETE
};