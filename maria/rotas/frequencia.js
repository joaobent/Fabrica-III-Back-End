import express from 'express';
// import pool from './servico/conexao.js';
const routerFrequencia= express.Router();
import {retornaFrequencias, retornaFrequenciasPorClienteId} from "../servicos/frequenciaServicos/buscar.js";
import { cadastraFrequencia } from "../servicos/frequenciaServicos/adicionar.js";
import { atualizaFrequencia } from "../servicos/frequenciaServicos/editar.js";
import { deletarFrequencia } from '../servicos/frequenciaServicos/deletar.js';


import bodyParser from 'body-parser'; // Importando o body-parser


const app = express();

// ESSA LINHA É ESSENCIAL:
app.use(express.json());

routerFrequencia.get('/', async (req, res) => {
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
routerFrequencia.get('/:id', async (req, res) => {
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

// Usando o bodyParser para lidar com JSON
app.use(bodyParser.json());  // Isso vai garantir que o body seja interpretado corretamente

// Rota POST para criação de frequência
routerFrequencia.post('/', async (req, res) => {
  try {
    const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

    if (!clientes_idclientes || !dataEntrada || !dataSaida) {
      return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    if (isNaN(clientes_idclientes) || clientes_idclientes <= 0) {
      return res.status(400).json({ mensagem: 'ID do cliente inválido.' });
    }

    const id = await cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida);

    res.status(201).json({ mensagem: 'Frequência criada com sucesso', id });
  } catch (erro) {
    console.error('Erro ao cadastrar frequência:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});




// Rota para atualizar uma frequência existente
routerFrequencia.put('/:id', async (req, res) => {
    const idfrequencia = req.params.id;
    const { dataEntrada, dataSaida, clientes_idclientes } = req.body;

    if (!dataEntrada || !dataSaida || !clientes_idclientes) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    try {
        const resultado = await atualizaFrequencia(idfrequencia, clientes_idclientes, dataEntrada, dataSaida);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Frequência não encontrada' });
        }

        res.json({ mensagem: 'Frequência atualizada com sucesso' });
    } catch (erro) {
        console.error('Erro ao atualizar frequência:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});




routerFrequencia.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  try {
    const resultado = await deletarFrequencia(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Frequência deletada com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar frequência:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});



export default routerFrequencia;