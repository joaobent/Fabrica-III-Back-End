// Aqui serÃo colocadas todos os endpoints da API


import express from 'express';
// import pool from './servico/conexao.js';
import {retornaFuncionarios,
    retornaFuncionariosPorNome} from "./servico/retorna_servico.js"

const app = express();

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

app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});