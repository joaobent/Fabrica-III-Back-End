import express from 'express';
// import pool from './servico/conexao.js';
const routerFrequencia= express.Router();
import { retornaFrequencias, buscarFrequenciaPorId, retornaFrequenciasPorClienteId } from "../servicos/frequenciaServicos/buscar.js";
import { cadastraFrequencia } from "../servicos/frequenciaServicos/adicionar.js";
import { atualizaFrequencia } from "../servicos/frequenciaServicos/editar.js";
import { atualizaFrequenciaParcial } from '../servicos/frequenciaServicos/editartudo.js';
import { deletarFrequencia } from '../servicos/frequenciaServicos/deletar.js';
import { validarFrequencia, validarExistenciaFrequencia, validarFrequenciaParcial } from '../validacao/frequenciaValidacao.js';
import bodyParser from 'body-parser'; // Importando o body-parser


const app = express();

// ESSA LINHA É ESSENCIAL:
app.use(express.json());



routerFrequencia.get('/', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Retorna a lista de todas as frequências cadastradas.'
/* #swagger.responses[200] = {
    description: 'Lista de frequências retornada com sucesso.',
    schema: [
      {
        idfrequencia: 1,
        clientes_idclientes: 10,
        dataEntrada: '2024-05-01T10:00:00Z',
        dataSaida: '2024-05-01T11:00:00Z'
      }
    ]
} */
/* #swagger.responses[404] = {
    description: 'Nenhuma frequência encontrada.',
    schema: { mensagem: 'Frequência não encontrada' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno ao buscar frequências.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
  const { id } = req.params;

    try {
        const frequencias = await retornaFrequencias();
         if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada' });
    }

    res.json(frequencias);
    } catch (erro) {
        console.error('Erro ao buscar frequências por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});



// Rota para buscar uma frequência por ID
routerFrequencia.get('/:id', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Busca uma frequência específica pelo ID.'
/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da frequência',
    required: true,
    type: 'integer'
} */
/* #swagger.responses[200] = {
    description: 'Frequência encontrada com sucesso.',
    schema: {
      idfrequencia: 1,
      clientes_idclientes: 10,
      dataEntrada: '2024-05-01T10:00:00Z',
      dataSaida: '2024-05-01T11:00:00Z'
    }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Frequência não encontrada.',
    schema: { mensagem: 'Frequência não encontrada' }
} */

    const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

    try {
        const frequencias = await buscarFrequenciaPorId(id);

        if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada' });
    }

    res.json(frequencias);
    } catch (erro) {
        console.error('Erro ao buscar frequência por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});


// GET - Frequências por ID do Cliente
routerFrequencia.get('/cliente/:id', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Retorna todas as frequências relacionadas a um cliente específico.'
/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID do cliente',
    required: true,
    type: 'integer'
} */
/* #swagger.responses[200] = {
    description: 'Lista de frequências do cliente retornada com sucesso.',
    schema: [
      {
        idfrequencia: 1,
        clientes_idclientes: 10,
        dataEntrada: '2024-05-01T10:00:00Z',
        dataSaida: '2024-05-01T11:00:00Z'
      }
    ]
} */
/* #swagger.responses[400] = {
    description: 'ID do cliente inválido.',
    schema: { mensagem: 'ID do cliente inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Nenhuma frequência encontrada para o cliente.',
    schema: { mensagem: 'Nenhuma frequência encontrada para este cliente.' }
} */
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID do cliente inválido.' });
  }

  try {
    const frequencias = await retornaFrequenciasPorClienteId(id);

    if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma frequência encontrada para este cliente.' });
    }

    res.status(200).json(frequencias);
  } catch (erro) {
    console.error('Erro ao buscar frequência por ID do cliente:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});



// Usando o bodyParser para lidar com JSON
app.use(bodyParser.json());  // Isso vai garantir que o body seja interpretado corretamente

// Rota POST para criação de frequência
routerFrequencia.post('/', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Cadastra uma nova frequência.'
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      clientes_idclientes: 10,
      dataEntrada: '2024-05-01T10:00:00Z',
      dataSaida: '2024-05-01T11:00:00Z'
    }
} */
/* #swagger.responses[201] = {
    description: 'Frequência criada com sucesso.',
    schema: { mensagem: 'Frequência criada com sucesso', id: 1 }
} */
/* #swagger.responses[400] = {
    description: 'Dados inválidos ou incompletos.',
    schema: { mensagem: 'Dados incompletos' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno ao cadastrar frequência.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
  try {
    const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

    const validacao = await validarFrequencia(clientes_idclientes, dataEntrada, dataSaida);
    if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

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
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Atualiza completamente uma frequência existente.'
/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da frequência',
    required: true,
    type: 'integer'
} */
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      clientes_idclientes: 10,
      dataEntrada: '2024-05-01T10:00:00Z',
      dataSaida: '2024-05-01T11:00:00Z'
    }
} */
/* #swagger.responses[200] = {
    description: 'Frequência atualizada com sucesso.',
    schema: { mensagem: 'Frequência atualizada com sucesso' }
} */
/* #swagger.responses[400] = {
    description: 'Dados inválidos.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Frequência não encontrada.',
    schema: { mensagem: 'Frequência não encontrada' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao atualizar frequência.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
  const idfrequencia = req.params.id;
  const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

  if (isNaN(idfrequencia) || idfrequencia <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(idfrequencia);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  const validacao = await validarFrequencia(clientes_idclientes, dataEntrada, dataSaida);
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
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


routerFrequencia.patch('/:id', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Atualiza parcialmente os dados de uma frequência.'
/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da frequência',
    required: true,
    type: 'integer'
} */
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      clientes_idclientes: 10,
      dataEntrada: '2024-05-01T10:00:00Z',
      dataSaida: '2024-05-01T11:00:00Z'
    }
} */
/* #swagger.responses[200] = {
    description: 'Frequência atualizada com sucesso (parcial).',
    schema: { mensagem: 'Frequência atualizada com sucesso (parcial).' }
} */
/* #swagger.responses[400] = {
    description: 'Dados inválidos.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Frequência não encontrada.',
    schema: { mensagem: 'Frequência não encontrada ou nenhum dado atualizado.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno ao atualizar frequência.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
  const idfrequencia = req.params.id;
  const { dataEntrada, dataSaida, clientes_idclientes } = req.body;

  if (isNaN(idfrequencia) || idfrequencia <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(idfrequencia);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  const validacao = await validarFrequenciaParcial({ dataEntrada, dataSaida, clientes_idclientes });
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  try {
    const resultado = await atualizaFrequenciaParcial(idfrequencia, { dataEntrada, dataSaida, clientes_idclientes });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada ou nenhum dado atualizado.' });
    }

    res.json({ mensagem: 'Frequência atualizada com sucesso (parcial).' });
  } catch (erro) {
    console.error('Erro ao atualizar frequência (PATCH):', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor', erro: erro.message });
  }
});



routerFrequencia.delete('/:id', async (req, res) => {
  // #swagger.tags = ['Frequência']
// #swagger.description = 'Deleta uma frequência pelo ID.'
/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da frequência a ser deletada',
    required: true,
    type: 'integer'
} */
/* #swagger.responses[200] = {
    description: 'Frequência deletada com sucesso.',
    schema: { mensagem: 'Frequência deletada com sucesso.' }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Frequência não encontrada.',
    schema: { mensagem: 'Frequência não encontrada.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao deletar frequência.',
    schema: { mensagem: 'Erro interno no servidor.' }
} */
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(id);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
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