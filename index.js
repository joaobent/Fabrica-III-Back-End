// Aqui serÃo colocadas todos os endpoints da API


import express from 'express';
// import pool from './servico/conexao.js';
import {retornaFuncionarios,
    retornaFuncionariosPorNome, cadastrarFuncionario} from "./servico/funcoesDaAna.js"

const app = express();
app.use(express.json()); 

app.get('/funcionarios', async (req, res) => {
    let resultado;
    const nome = req.query.nome;

    try {
        if (!nome) {
            resultado = await retornaFuncionarios();
        } else if (nome) {
            resultado = await retornaFuncionariosPorNome(nome);
        } 

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ mensagem: "Nenhum funcionário encontrado" });
        }
    } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
        res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
});

app.post("/funcionarios", async (req, res) => {
    try {
        const dados = req.body;

        const resultado = await cadastrarFuncionario(dados);
        res.status(201).json({ mensagem: "Funcionário cadastrado com sucesso!", id: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao cadastrar funcionário:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar funcionário." });
    }
});

app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});