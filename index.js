// Aqui serÃo colocadas todos os endpoints da API


import express from 'express';
// import pool from './servico/conexao.js';
import {retornaFuncionarios,
    retornaFuncionariosPorNome, retornaFrequencias,
    retornaFrequenciasPorClienteId} from "./servico/retorna_servico.js"

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


// Rota para buscar todas as frequências
app.get('/frequencia', async (req, res) => {
    try {
        const frequencias = await retornaFrequencias();
        if (frequencias.length > 0) {
            res.json(frequencias);
        } else {
            res.status(404).json({ mensagem: 'Nenhuma frequência encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao buscar frequências:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

// Rota para buscar uma frequência por ID
app.get('/frequencia/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const frequencia = await retornaFrequenciasPorClienteId(id);
        if (frequencia) {
            res.json(frequencia);
        } else {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao buscar frequência por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

// Rota para criar uma nova frequência
app.post('/frequencia', async (req, res) => {
    const { clientes_idclientes, dataEntrada, dataSaida } = req.body;
    try {
        const id = await cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida);
        res.status(201).json({ mensagem: 'Frequência criada com sucesso', id });
    } catch (erro) {
        console.error('Erro ao criar frequência:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});


app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});