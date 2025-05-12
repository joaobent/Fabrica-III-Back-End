// Aqui serÃo colocadas todos os endpoints da API

import express from 'express';
// import pool from './servico/conexao.js';
<<<<<<< HEAD
import {retornaFuncionarios, retornaFuncionariosPorNome, retornaFrequencias, retornaFrequenciasPorClienteId} from "./servico/retorna_servico.js";
// import { cadastraFrequencia } from "./servico/cadastra_servico.js";
=======


const app = express();

app.use(express.json()); 

import routerFuncionario from './ana/rotas/funcionarios.js';

app.use('/funcionarios', routerFuncionario)

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



//Rota para criar uma nova frequência
app.post('/frequencia', async (req, res) => {
    console.log("req.body recebido:", req.body); // Ajuda a ver o que está chegando

    const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

    if (!clientes_idclientes || !dataEntrada || !dataSaida) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

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