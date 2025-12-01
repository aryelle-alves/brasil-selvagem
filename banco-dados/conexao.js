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

    // Tabela de animais
    banco.run(`CREATE TABLE IF NOT EXISTS animais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        bioma TEXT NOT NULL,
        descricao TEXT,
        curiosidade TEXT
    )`, (erro) => {
        if (erro) {
            console.error('❌ Erro criar tabela animais:', erro);
        } else {
            console.log('✅ Tabela animais criada/verificada');
        }
    });
}

module.exports = banco;